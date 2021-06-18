import { Logger, s, Argv } from 'koishi-core';
import { CQBot } from 'koishi-adapter-onebot';
import axios from 'axios';
import _ from 'lodash';

import Config from './config';
import { byteLenth } from './CustomFunc';
import { PointsData, FindData, FindDataPlayer } from './TsFreddieAPIInterface';
import { Session } from 'koishi';

// declare module 'koishi-core' {
//     namespace Argv {
//         interface Domain {
//             ddnetUsername: string;
//         }
//     }
// }

export function testUserName(name: string): boolean {
    const bytes = byteLenth(name);
    return 0 < bytes && bytes <= 15;
}

export function commandCheckUserName(name: string) {
    return testUserName(name) ? void 0 : Config.ddnetUsernameErrorMsg;
}

// Argv.createDomain('ddnetUsername', (source) => {
//     if (!testUserName(source))
//         throw new Error(`${Config.ddnetUsernameErrorMsg.slice(1, -1)}。`);
//     return source;
// });

export async function getPoints(name: string, logger: Logger): Promise<string> {
    let result = `${name}\n\n`;

    try {
        if (testUserName(name)) {
            const { data }: { data: PointsData } = await axios(
                `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
                    name
                )}.json`,
                {
                    headers: {
                        'accept-encoding': 'gzip, deflate',
                        decompress: true,
                    },
                }
            );
            if (data.player) {
                const favServer = _.maxBy(
                    _.toPairs(_.groupBy(data.last_finishes, 'country')),
                    '1.length'
                )?.[0];

                result += `${favServer}\n${data.points.rank}. with ${data.points.points} points`;
            } else {
                result += Config.noPointsMsg;
            }
        } else {
            result += `${Config.noPointsMsg}\n${Config.ddnetUsernameErrorMsg}`;
        }

        // 向字符串的末尾添加一个字符标志位，判断是否出现404；若出现则代表该名下无分数，需要执行指令`find`显示玩家是否在线
        // result += 'y';
    } catch (e) {
        if (e.response.status === 404) {
            result += e?.response?.data?.error ?? Config.unknownErrorMsg;
            // result += 'e';
        } else {
            logger?.extend('getPoints').error(e);
            result += Config.unknownErrorMsg;
            // result = '?';
        }
    }

    return result;
}

// export async function ifExists(name: string, logger: Logger): Promise<boolean> {
//     try {
//         await axios(
//             `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
//                 name
//             )}`,
//             {
//                 headers: {
//                     'accept-encoding': 'gzip, deflate',
//                     decompress: true,
//                 },
//             }
//         );
//         return true;
//     } catch (e) {
//         logger?.extend('ifExists').error(e);
//         return false;
//     }
// }

// export async function getOnePoints(name: string, n: number): Promise<string> {
//     if (!(await ifExists(name))) return `${name}\n\n该玩家不存在`;
//     try {
//         const { data } = await axios.get(
//             `https://ddnet.tw/players/${encodeURIComponent(name)}/`
//         );

//         const results = new RegExp(
//             `<div class="block2 ladder"><h3>(?<title>.*?)<[/]h3>\\n<p class="pers-result">(?<points>((\\d+). with (\\d+) points)|(Unranked))<[/]p><[/]div>`,
//             'g'
//         );

//         while (n > 0) {
//             results.exec(data);
//             n -= 1;
//         }

//         const result = results.exec(data)?.groups;

//         if (result) {
//             return `${name}\n\n${result.title}\n${result.points}`;
//         } else {
//             throw new Error();
//         }
//     } catch (e) {
//         return '$出现未知错误';
//     }
// }

// export async function ifExists(name: string): Promise<boolean> {
//     try {
//         const { data } = await axios.get('https://ddnet.tw/players/', {
//             params: { query: encodeURIComponent(name) },
//         });
//         if (data) {
//             for (const element of data) {
//                 if (element.name === name) return true;
//             }
//         }
//         return false;
//     } catch {
//         return false;
//     }
// }

function wrapFindMsg(player: FindDataPlayer) {
    const { server } = player;
    return `${
        player.clan === '' ? '(no clan)' : 'clan：' + player.clan
    }\n\n位于${server.locale}服务器：\n${server.name}\n\nmap：${server.map}`;
}

export async function find(
    session: Session,
    name: string,
    logger: Logger,
    noDetail?: boolean
): Promise<void> {
    const atSender = s('at', { id: session?.userId! });
    if (!name) {
        session?.sendQueued(atSender + 'find指令缺少参数name');
        return;
    } else if (!testUserName(name)) {
        session?.sendQueued(atSender + Config.ddnetUsernameErrorMsg);
        return;
    }

    const _result = `${name}\n\n`;
    let result = _result;
    const toFind = 'as:cn';

    try {
        // 默认为true
        const { data }: { data: FindData } = await axios(
            `https://api.teeworlds.cn/servers/players?name=${encodeURIComponent(
                name
            )}&detail=${noDetail ?? false ? 'false' : 'true'}`,
            {
                headers: {
                    'accept-encoding': 'gzip',
                },
            }
        );
        const { players } = data;

        if (players.length === 0) {
            result += '该玩家目前不在线';
            session?.sendQueued(result);
        } else if (players.length === 1) {
            const player = players[0];

            result += wrapFindMsg(player);
            session?.sendQueued(result);
        } else {
            const lenth = players.length;
            const seperate = '-'.repeat(30);

            // i points to all; j only points to 'CN'
            for (let i = 0, j = 0, countCN = 0; i < lenth && j <= lenth; i++) {
                while (j < lenth && players[j].server.locale !== toFind) j++;

                let player = undefined;
                if (i === 0)
                    if (j < lenth) {
                        // 匹配到位于CN的玩家
                        if (countCN === 0)
                            session?.sendQueued(
                                atSender + `查找到${lenth}位玩家，首位如下：`
                            );

                        countCN++;
                        player = players[j];
                        j++;
                        i--;
                    } else {
                        // 遍历CN完毕

                        if (countCN) {
                            // 曾遍历到CN玩家
                            if (lenth - countCN > 0)
                                // 仍有位于其他国家的玩家
                                session?.sendQueued(
                                    atSender +
                                        '位于CN的玩家已显示完毕，是否显示其它在线重名玩家？（y/...）'
                                );
                            else {
                                // 所有玩家均位于CN
                                break;
                            }
                        } else {
                            // 未遍历到CN玩家
                            session?.sendQueued(
                                atSender +
                                    '未查找到任何位于CN的玩家，是否显示其它在线重名玩家？（y/...）'
                            );
                        }

                        const reply = await session?.prompt()!;
                        if (!reply) {
                            session?.sendQueued(atSender + '输入超时。');
                            return;
                        }

                        if (!/[yY]/.test(reply)) break;
                    }

                // 只要之前未跳出就会执行下段
                // 若之前未找到CN玩家，则此处player===undifined
                player = player ?? players[i];

                // 若此时player指向已遍历的CN玩家
                if (i !== -1 && j === lenth && player.server.locale === toFind)
                    continue;
                let { server } = player;

                result += wrapFindMsg(player);
                if (i < lenth) {
                    result += `\n${seperate}\n\n回复：\ny-继续查看\nip-获取服务器ip并结束对话\n（回复其它则结束对话）`;
                    session?.sendQueued(result);
                    const reply = await session?.prompt()!;

                    if (!reply) {
                        session?.sendQueued(atSender + '输入超时。');
                        return;
                    }

                    if (/[yY]/.test(reply)) {
                        result = _result;
                        continue;
                    } else if (/ip/.test(reply)) {
                        session?.sendQueued(`${server.ip}:${server.port}`);
                        break;
                    } else break;
                }
            }
            session?.sendQueued('$find查看完毕$');
        }
    } catch (e) {
        logger.extend('find').error(e);
        session?.sendQueued(Config.unknownErrorMsg);
    }
}

export async function sendGMRReminder(
    bot: CQBot,
    userId: string,
    groupId: string,
    _answer: string,
    logger: Logger
): Promise<string | undefined> {
    const targetGroup = await bot.getGroup(groupId);
    const seperate = '-'.repeat(30);

    const answer = _answer !== '' ? _answer : userId;
    const pointsMessage = await getPoints(answer, logger);

    const newReplyMessageId = await bot.sendGroupMessage(
        Config.motGroup,
        `$收到入群申请$\n\n申请人：${userId}\n\n目标群：${
            targetGroup.groupId
        }\n${targetGroup.groupName}\n\n${seperate}\n${
            _answer === '' ? '$用户未提供答案，使用QQ号查询分数$\n' : ''
        }${pointsMessage}\n${seperate}\n\n回复此消息以处理入群申请\n（y/n/n [reason...]/i=忽略）`
    );

    if (
        pointsMessage.endsWith(Config.pointsData404ErrorMsg) ||
        pointsMessage.endsWith(Config.pointsData404ErrorMsgBackup)
    ) {
        find(
            bot.createSession({
                type: 'send',
                subtype: 'group',
                platform: 'onebot',
                selfId: Config.developer.onebot,
                groupId: Config.motGroup,
                channelId: Config.motGroup,
            }),
            answer,
            logger
        );

        return newReplyMessageId;
    } else {
        return;
    }
}

import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import axios from 'axios';
import _ from 'lodash';

import Config from './config';
import { PointsData } from './TsFreddieAPIInterface';

export async function getPoints(name: string, logger: Logger): Promise<string> {
    let result = `${name}\n\n`;

    try {
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
            result += 'Player Not Found';
        }
    } catch (e) {
        if (e.response.status === 404)
            result += e?.response?.data?.error ?? '$出现未知错误';
        else logger?.extend('getPoints').error(e);
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

export async function sendGMRReminder(
    bot: CQBot,
    userId: string,
    groupId: string,
    answer: string,
    logger: Logger
): Promise<string> {
    const targetGroup = await bot.getGroup(groupId);
    const seperate = '-'.repeat(30);

    const newReplyMessageId = await bot.sendGroupMessage(
        Config.motGroup,
        `$收到入群申请$\n\n申请人：${userId}\n\n目标群：${
            targetGroup.groupId
        }\n${targetGroup.groupName}\n\n${seperate}\n${
            answer ? await getPoints(answer, logger) : userId
        }\n${seperate}\n\n回复此消息以处理入群申请\n（y/n/n [reason...]/i=忽略）`
    );
    return newReplyMessageId;
}

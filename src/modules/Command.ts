import { Context, Time, sleep, s } from 'koishi-core';
import { RecallConfig } from 'koishi-plugin-common';
import { resolve } from 'path';
import axios from 'axios';
import _ from 'lodash';

import Config from '../utils/config';
import { getDevCtx, getMotCtx } from '../utils/CustomFunc';
import { getPoints, sendGMRReminder } from '../utils/DDNetOrientedFunc';
import { FindData } from '../utils/TsFreddieAPIInterface';

module.exports.name = 'Command';

module.exports.apply = (ctx: Context) => {
    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    devCtx.plugin(eco);
    devCtx.plugin(reg);

    motCtx.plugin(recall, {});
    motCtx.plugin(newmod);
    motCtx.plugin(points);
    motCtx.plugin(gmr);
    motCtx.plugin(spot);

    devCtx.command('cdelete').action(async ({ session }) => {
        const channelId = session?.channelId!;
        let mId = (await session?.bot.sendMessage(channelId, 'pre'))!;

        await sleep(4 * Time.minute);
        session?.bot.deleteMessage(channelId, mId);
    });

    devCtx.command('ct').action(async ({ session }) => {
        // session?.send('CommandTest');
    });
};

function eco(ctx: Context) {
    ctx.command('eco <message:text>', '输出收到的信息', { authority: 1 })
        .option('encode', '-e 输出编码（encode）后的信息')
        .option('decode', '-d 输出解码（decode）后的信息')
        .option('timeout', '-t [seconds:number] 设定延迟发送的时间')
        .usage('注意：参数请写在最前面，不然会被当成 message 的一部分！\n')
        .example('eho -t 300 Hello World  五分钟后发送 Hello World')
        .alias('say')
        .shortcut('说话', { args: ['会说话了'] })
        .shortcut('说鬼话', { options: { encode: true }, fuzzy: true })
        .shortcut('说人话', { options: { decode: true }, fuzzy: true })
        .check(({ options }, message) =>
            options?.encode ? encodeURI(message) : void 0
        )
        .check(({ options }, message) =>
            options?.decode ? decodeURI(message) : void 0
        )
        .action(async ({ options }, message) => {
            if (options?.timeout) await sleep(options.timeout * Time.second);
            return message;
        });
}

function reg(ctx: Context) {
    ctx.command('reg', '测试正则表达式')
        .option('regex', '-r [regex:text] 指定正则表达式')
        .option('string', '-s [string:text] 指定字符串')
        .action(async ({ options }) => {
            const _regex = '([yY]|(?:[nN]|[nN] (?<reason>.*))|[iI])$';
            const _string = '';

            const regex = new RegExp(options?.regex ?? _regex, 'g');
            const string = options?.string ?? _string;
            const result = regex.exec(string);
            console.log(result);
        });
}

function newmod(ctx: Context) {
    ctx.command('newmod <mod:user> <name:string>', '注册新管理员', {
        authority: 4,
    })
        .usage('注意：昵称一定要使用单引号包裹！\n')
        .example("newmod @Mind 'Mind'\n此处的@Mind不是一串文本")
        .action(async ({ session }, mod, name) => {
            const atSender = s('at', { id: session?.userId! });

            // koishi已存在对数据格式的内部判断
            const onebot = /onebot:(?<onebot>\d+)/.exec(mod)?.groups?.onebot;

            if (
                onebot === undefined ||
                onebot === session?.selfId ||
                onebot === Config.developer.onebot ||
                name === undefined
            ) {
                session?.sendQueued(
                    atSender + '注册信息不规范！请查看如下说明！'
                );
                session?.execute('help newmod');
                return;
            }

            const user = await ctx.database.getUser('onebot', onebot);
            if (user !== undefined) {
                if (user.authority === 3) {
                    session?.sendQueued(
                        '该用户已经是管理员了！此次指令是否要修改昵称？（y/...）'
                    );
                    const reply = await session?.prompt()!;
                    if (!reply) {
                        session?.sendQueued(atSender + '输入超时。');
                        return;
                    }
                    if (/[yY]/.test(reply)) {
                        ctx.database.setModerator('onebot', onebot, {
                            name: name,
                        });
                        session?.sendQueued(
                            atSender + 'mod昵称修改为：\n' + name
                        );
                    } else {
                        session?.sendQueued('newmod退出');
                    }

                    return;
                } else {
                    ctx.database.setUser('onebot', onebot, {
                        name: name,
                        authority: 3,
                    });
                }
            } else {
                ctx.database.createModerator({ onebot: onebot, name: name });
            }
            session?.send(`注册成功！\n欢迎你，${s('at', { id: onebot })}！`);
        });
}

function recall(ctx: Context, { recallCount = 10 }: RecallConfig) {
    ctx = ctx.group();
    const recent: Record<string, string[]> = {};

    ctx.on('send', (session) => {
        const list = (recent[session.channelId!] ||= []);
        list.unshift(session.messageId!);
        if (list.length > recallCount) {
            list.pop();
        }
    });

    ctx.command('recall [count:number]', '撤回 bot 发送的消息', {
        authority: 3,
    }).action(async ({ session }, count = 1) => {
        const list = recent[session?.channelId!];
        if (!list) return '近期没有发送消息。';
        const removal = list.splice(0, count);
        const delay = ctx.app?.options.delay?.broadcast;
        if (!list.length) delete recent[session?.channelId!];
        for (let index = 0; index < removal.length; index++) {
            if (index && delay) await sleep(delay);
            try {
                await session?.bot.deleteMessage(
                    session?.channelId!,
                    removal[index]
                );
            } catch (error) {
                ctx.logger('bot').warn(error);
            }
        }
    });
}

function points(ctx: Context) {
    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 }).action(
        async ({ session }, name) => {
            return await getPoints(
                name ??
                    (session?.author?.nickname !== ''
                        ? session?.author?.nickname
                        : session?.username),
                ctx.logger('points')
            );
        }
    );
}

function gmr(ctx: Context) {
    ctx.command('gmr', '获取5条未处理的入群申请', { authority: 3 })
        // .option('number', '-n [n:posint] 获取n条入群申请', { fallback: 5 })
        .usage('(Group Member Request)')
        .action(async ({ session }) => {
            const gmrs = await ctx.database.getGMRs_N(5);
            if (Array.isArray(gmrs) && gmrs.length === 0)
                return '$所有入群申请已被处理$';
            for (const gmr of gmrs) {
                const newReplyMessageId = await sendGMRReminder(
                    session!.bot,
                    gmr.userId,
                    gmr.groupId,
                    gmr.content,
                    ctx.logger('points')
                );
                await ctx.database.updateGMR(gmr.messageId, newReplyMessageId!);
            }
        });
}

function spot(ctx: Context) {
    const logger = ctx.logger('Command').extend('spot');

    ctx.command('spot', '（Seek-Locate-Destroy）', { authority: 3 });

    ctx.command('spot/client', '查看client信息').action(async ({ session }) => {
        session?.send(
            s('image', {
                file: 'file://' + resolve(__dirname, '../static/client.jpg'),
            })
        );
    });

    ctx.command('spot/find <name:text>', '查找在线状态')
        .option('noDetail', '-nd')
        .action(async ({ session, options }, name) => {
            const atSender = s('at', { id: session?.userId! });
            if (name === undefined) {
                session?.sendQueued(atSender + 'find指令缺少参数name');
                return;
            }

            const _result = `${name}\n\n`;
            let result = _result;
            const toFind = 'as:cn';

            try {
                // 默认为true
                const { data }: { data: FindData } = await axios(
                    `https://api.teeworlds.cn/servers/players?name=${name}&detail=${
                        options?.noDetail ?? false ? 'false' : 'true'
                    }`,
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
                    const { server } = player;

                    result += `${
                        player.clan === ''
                            ? '(no clan)'
                            : 'clan：' + player.clan
                    }\n位于${server.locale}服务器：\n${server.name}\nmap：${
                        server.map
                    }`;

                    session?.sendQueued(result);
                } else {
                    const lenth = players.length;
                    const seperate = '-'.repeat(30);

                    // i points to all; j only points to 'CN'
                    for (
                        let i = 0, j = 0, countCN = 0;
                        i < lenth && j <= lenth;
                        i++
                    ) {
                        while (j < lenth && players[j].server.locale !== toFind)
                            j++;

                        let player = undefined;
                        if (i === 0)
                            if (j < lenth) {
                                // 匹配到位于CN的玩家
                                if (countCN === 0)
                                    session?.sendQueued(
                                        atSender +
                                            `查找到${lenth}位玩家，首位如下：`
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
                                    session?.sendQueued(
                                        atSender + '输入超时。'
                                    );
                                    return;
                                }

                                if (!/[yY]/.test(reply)) break;
                            }

                        // 只要之前未跳出就会执行下段
                        // 若之前未找到CN玩家，则此处player===undifined
                        player = player ?? players[i];

                        // 若此时player指向已遍历的CN玩家
                        if (
                            i !== -1 &&
                            j === lenth &&
                            player.server.locale === toFind
                        )
                            continue;
                        let { server } = player;

                        result += `${
                            player.clan === ''
                                ? '(no clan)'
                                : 'clan：' + player.clan
                        }\n位于${server.locale}服务器：\n\n${
                            server.name
                        }\nmap：${server.map}`;
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
                                session?.sendQueued(
                                    `${server.ip}:${server.port}`
                                );
                                break;
                            } else break;
                        }
                    }
                    session?.sendQueued('$find查看完毕$');
                }
            } catch (e) {
                logger.extend('find').error(e);
                session?.sendQueued('$出现未知错误$');
            }
        });
}

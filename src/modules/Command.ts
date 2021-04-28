import { Context, Time, sleep } from 'koishi';

import Config from '../utils/config';
import { getPoints, sendGMRReminder } from '../utils/DDNetOrientedFunc';

module.exports.name = 'Command';

module.exports.apply = (ctx: Context) => {
    const testCtx = Config.getTestCtx(ctx);
    const motCtx = Config.getMotCtx(ctx);
    
    testCtx
        .command('eco <message:text>', '输出收到的信息', { authority: 1 })
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

    testCtx
        .command('b <content:_text>', '广播', { authority: 4 })
        .alias('broadcast^')
        .shortcut('广播', { fuzzy: true })
        .action(async ({ session }, content) => {
            await session?.bot.broadcast([Config.testGroup], content);
            return '广播结束';
        });

    motCtx
        .command('points [name:text]', '查询ddr分数')
        .action(async ({ session }, name) => {
            return await getPoints(
                name ??
                    (session?.author?.nickname !== ''
                        ? session?.author?.nickname
                        : session?.username)
            );
        });

    // ctx.command('lottery', '随机获取ddr分数').action(async ({ session }) => {
    //     await session?.sendQueued(
    //         s('at', { id: session.userId as string }) +
    //             `\n恭喜 ${
    //                 session.author?.nickname ?? session.author?.username
    //             } 获得：\n+${Random.int(500)}points`
    //     );
    //     await sleep(4 * Time.second);
    //     await session?.sendQueued('但是不给（');
    // });

    motCtx
        .command('gmr', '获取5条未处理的入群申请')
        // .option('number', '-n [n:posint] 获取n条入群申请', { fallback: 5 })
        .usage('(Group Member Request)\n')
        .action(async ({ session }) => {
            const gmrs = await motCtx.database.getGMRs_N(5);
            if (Array.isArray(gmrs) && gmrs.length === 0)
                return '$所有入群申请已被处理$';
            for (const gmr of gmrs) {
                const newReplyMessageId = await sendGMRReminder(
                    session!.bot,
                    gmr.userId,
                    gmr.groupId,
                    gmr.content
                );
                await ctx.database.updateGMR(
                    'messageId',
                    gmr.messageId,
                    newReplyMessageId as string
                );
            }
        });

    testCtx.command('cdelete').action(async ({ session }) => {
        const channelId = session?.channelId as string;
        let mId = (await session?.bot.sendMessage(channelId, 'pre')) as string;

        await sleep(4 * Time.minute);
        session?.bot.deleteMessage(channelId, mId);
    });

    testCtx.command('ct').action(async ({ session }) => {
        session?.send('CommandTest');
    });
};

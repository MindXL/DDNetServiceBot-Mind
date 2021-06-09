import { Context, s } from 'koishi';

import Config from '../utils/config';
import { getDevCtx, getMotCtx, sf } from '../utils/CustomFunc';
import '../utils/MysqlExtends/Moderator';

module.exports.name = 'MessageHandler';

module.exports.apply = (ctx: Context) => {
    ctx.middleware((session, next) => {
        if (session.content === 'hlep') {
            // 如果该 session 没有被截获，则这里的回调函数将会被执行
            return next(() => session.send('你想说的是 help 吗？'));
        } else {
            return next();
        }
    });

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    motCtx.plugin(handleGMR);

    // 回应"hh"消息
    devCtx.middleware((session, next) => {
        if (session.content === 'hh') {
            session.send('surprise');
        }
        return next();
    });

    // 回应@消息
    // devCtx.middleware((session, next) => {
    //     // 仅当接收到的消息包含了对机器人的称呼时才继续处理（比如消息以 @机器人 开头）
    //     if (session.content === 's') {
    //         return session.send('是你在叫我吗？');
    //     } else {
    //         // 如果去掉这一行，那么不满足上述条件的消息就不会进入下一个中间件了
    //         return next();
    //     }
    // });

    // 同一消息连续发送3次则复读一次
    // let times = 0; // 复读次数
    // let message = ''; // 当前消息
    // devCtx.middleware((session, next) => {
    //     if (session.content === message) {
    //         times += 1;
    //         if (times === 3) return session.send(message);
    //     } else {
    //         times = 0;
    //         message = session.content!;
    //         return next();
    //     }
    // }, true /* true 表示这是前置中间件 */);

    // ctx.middleware(async (session, next) => {
    //     if (session.parsed?.appel) {
    //         // // @某某用户 我在叫你哟！
    //         // await session.sendQueued(
    //         //     s('at', { id: session.userId! }) + '我在叫你哟！'
    //         // );

    //         // // 你发送了一张 Koishi 图标
    //         // await session.sendQueued(
    //         //     s('image', { url: 'https://koishi.js.org/koishi.png' })
    //         // );

    //         // await session.sendQueued(
    //         //     s('anonymous', { ignore: false }) + '这是一条匿名消息。'
    //         // );

    //         // await session.sendQueued(
    //         //     s('quote', { id: session.messageId! }) +
    //         //         '这是一条回复消息。'
    //         // );

    //         // await session.sendQueued(
    //         //     s.join([
    //         //         sf('at', { id: session.userId! }),
    //         //         sf('image', { url: 'https://koishi.js.org/koishi.png' }),
    //         //     ]) + '这是一条组合消息的join实现'
    //         // );

    //         // await session.sendQueued(
    //         //     s.join(
    //         //         s.parse(
    //         //             s('at', { id: session.userId! }) +
    //         //                 s('image', {
    //         //                     url: 'https://koishi.js.org/koishi.png',
    //         //                 }) +
    //         //                 '这是一条组合消息的parse实现'
    //         //         )
    //         //     )
    //         // );

    //         session.cancelQueued();
    //         // 执行后续操作
    //     }
    //     return next();
    // });

    // ctx.middleware(async (session, next) => {
    //     if (session.content === 'login') {
    //         await session.send('请输入用户名：');

    //         const name = await session.prompt();
    //         if (!name) return session.send('输入超时。');

    //         // 执行后续操作
    //         return session.send(`${name}，请多指教！`);
    //     }
    //     return next();
    // });

    devCtx.middleware(async (session, next) => {
        if (session.content === 'mt') {
            // session.send('MessageTest');
        }
        return next();
    });
};

function handleGMR(ctx: Context) {
    ctx.middleware(async (session, next) => {
        const { quote } = session;
        // 非回复消息
        if (!quote) return next();

        const replyMessageId = quote.messageId!;

        const gmr = await ctx.database.getGMR('replyMessageId', {
            replyMessageId: replyMessageId,
        });
        // 被回复的消息非提示入群申请的消息
        if (gmr === undefined) return next();

        // 若非在册的管理员
        const modAuthority = (
            await ctx.database.getModerator('onebot', session.userId!, [
                'authority',
            ])
        )?.authority;
        if (modAuthority && modAuthority < 3) {
            session.send(
                s('at', { id: session.userId! }) +
                    '是新管理员吗？\n是的话请联系' +
                    s('at', { id: Config.developer.onebot }) +
                    '进行注册哦！'
            );
            // 注册指令位于Command.ts
            return next();
        }

        const regExp = /] ([yY]|(?:[nN]|[nN] (?<reason>.*))|[iI])$/g.exec(
            session.content!
        );

        const modReply = regExp?.[1];
        const reason = regExp?.groups?.reason;

        let botReply: string;
        if (modReply) {
            if (modReply === 'y' || modReply === 'Y') {
                botReply = '同意了该用户的入群申请';
                session.bot.handleGroupMemberRequest(gmr.messageId, true);
            } else if (modReply === 'i' || modReply === 'I') {
                botReply = '忽略了该用户的入群申请';
            } else {
                botReply =
                    '拒绝了该用户的入群申请\n拒绝理由：\n' + (reason ?? '无');
                session.bot.handleGroupMemberRequest(
                    gmr.messageId,
                    false,
                    reason ?? ''
                );
            }
            await ctx.database.removeGMR('replyMessageId', {
                replyMessageId: replyMessageId,
            });
        } else {
            botReply = '回复的消息格式似乎不正确，请重新回复';
        }

        await session.send(
            s.join([
                sf('quote', { id: replyMessageId }),
                sf('at', { id: session.userId! }),
                sf('at', { id: session.userId! }),
            ]) + `\n${botReply}`
        );

        try {
            await session.bot.deleteMessage(session.groupId!, replyMessageId);

            // 管理员不可撤回群主和管理员的消息
            await session.bot.deleteMessage(
                session.groupId!,
                session.messageId!
            );
        } catch (error) {}

        return next();
    });
}

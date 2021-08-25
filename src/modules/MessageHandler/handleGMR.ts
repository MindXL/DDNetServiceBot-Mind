import { Context } from 'koishi-core';
import { Logger, s } from 'koishi-utils';

import Config, { GMRCache } from '../../utils';

export function handleGMR(ctx: Context, logger: Logger) {
    ctx.middleware(async (session, next) => {
        try {
            const { quote } = session;

            // 若非回复消息
            if (!quote || quote.author?.userId !== Config.Onebot.selfId)
                return next();

            // 若消息格式不正确
            const regExp =
                /\[CQ:quote,id=[-\d]+\]\[CQ:at,id=\d+\]\s+\[CQ:at,id=\d+\]\s*([yY]|(?:[nN]|[nN]\s*(?<reason>.*))|[iI])\s*/.exec(
                    session.content!
                );
            if (!regExp) return next();

            const replyMessageId = quote.messageId!;

            // 使用缓存，避免向数据库请求
            const gmr =
                GMRCache[replyMessageId] ??
                (await ctx.database.getGMR('replyMessageId', {
                    replyMessageId,
                }));
            // 若被回复的消息非提示入群申请的消息
            if (!gmr) return next();

            const userId = session.userId!;
            // 若非在册的管理员
            const { authority: modAuthority } = await ctx.database.getUser(
                'onebot',
                userId,
                ['authority']
            );
            if (!modAuthority || modAuthority < 3)
                return session.send(
                    s('at', { id: userId }) +
                        '是新管理员吗？\n' +
                        '是的话请联系' +
                        s('at', { id: Config.Onebot.developer.onebot }) +
                        '进行注册哦！'
                );

            let botReply: string;
            const modReply = regExp[1];
            const reason = regExp.groups!.reason;
            if (modReply.match(/[yY]/)) {
                botReply = '同意了该用户的入群申请';
                session.bot.handleGroupMemberRequest(gmr.messageId, true);
            } else if (modReply.match(/[nN]/)) {
                botReply =
                    '拒绝了该用户的入群申请\n' +
                    '拒绝理由：\n' +
                    (reason ?? '无');
                session.bot.handleGroupMemberRequest(
                    gmr.messageId,
                    false,
                    reason
                );
            } else {
                botReply = '忽略了该用户的入群申请';
            }

            await ctx.database.removeGMR('replyMessageId', {
                replyMessageId,
            });
            delete GMRCache[replyMessageId];
            await session.sendQueued(
                s('quote', { id: replyMessageId }) +
                    s('at', { id: userId }) +
                    s('at', { id: userId }) +
                    `\n${botReply}`
            );

            await session.bot.deleteMessage(
                session.groupId!,
                gmr.replyMessageId
            );
            if (gmr.extraMsgIds)
                for (const extraMsgId of gmr.extraMsgIds)
                    await session.bot.deleteMessage(
                        session.groupId!,
                        extraMsgId
                    );
            // 管理员不可撤回群主和管理员的消息，这种错误不需抛出
            session.bot
                .deleteMessage(session.groupId!, session.messageId!)
                .catch(e => {});
        } catch (e) {
            logger.extend('handleGMR').error(e);
        }
        return next();
    });
}

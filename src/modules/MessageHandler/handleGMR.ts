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

            const replyMessageId = quote.messageId!;

            // 若被回复的消息非提示入群申请的消息
            // 使用缓存判断被回复的消息是否为入群申请的提示消息
            // undefined不会触发此函数，不必考虑
            if (!GMRCache.includes(replyMessageId)) return next();

            // 若消息格式不正确
            const regExp =
                /]\s*([yY]|(?:[nN]|[nN]\s+(?<reason>.*))|[iI])\s*$/g.exec(
                    session.content!
                );
            if (!regExp) return next();

            const gmr = await ctx.database.getGMR('replyMessageId', {
                replyMessageId,
            });

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
            GMRCache.splice(GMRCache.indexOf(replyMessageId), 1);
            await session.sendQueued(
                s('quote', { id: replyMessageId }) +
                    s('at', { id: userId }) +
                    s('at', { id: userId }) +
                    `\n${botReply}`
            );

            await session.bot.deleteMessage(session.groupId!, replyMessageId);
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

import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';

import Config, { parseGMRSession, sendGMRReminder } from '../../utils';

export function onGroupMemberRequest(ctx: Context, logger: Logger) {
    ctx.on('group-member-request', async session => {
        try {
            const answer =
                /答案：(.*?)$/.exec(session.content!)?.[1] ?? session.userId!;
            const gmr = parseGMRSession(session, answer);
            const [replyMessageId, error] = await sendGMRReminder(
                session.bot as CQBot,
                gmr
            );
            Object.assign(gmr, {
                replyMessageId:
                    replyMessageId ?? Config.GMRReserveReplyMessageId,
            });

            // 入群申请归档后再提示错误
            await ctx.database.createGMR(gmr);
            if (error) throw new Error(error);
        } catch (e) {
            logger.extend('group-member-request').error(e);
        }
    });
}

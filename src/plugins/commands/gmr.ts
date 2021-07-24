import { Context } from 'koishi';

import { sendGMRReminder } from '../../utils/DDNetOrientedFunc';

export function gmr(ctx: Context) {
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
                    ctx.logger('Command').extend('gmr')
                );
                await ctx.database.updateGMR(gmr.messageId, newReplyMessageId!);
            }
        });
}

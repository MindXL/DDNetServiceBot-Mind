import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

export async function onGroupMemberDeleted(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('group-member-deleted');

    ctx.on('group-member-deleted', async session => {
        try {
            await ctx.database.mysql.query(
                'UPDATE `user` SET ?? = ? WHERE ?? = ?',
                [session.platform, undefined, session.platform, session.userId]
            );
        } catch (e) {
            logger.error(e);
        }
    });
}

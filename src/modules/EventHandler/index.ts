import { Context } from 'koishi-core';

import { getWatchCtx } from '../../utils';
import { onceBeforeConnect } from './onceBeforeConnect';
import { onceConnect } from './onceConnect';
import { beforeCommand } from './beforeCommand';
import { onGroupMemberDeleted } from './onGroupMemberDeleted';

import '../../MysqlExtends';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('EventHandler');
    const watchCtx = getWatchCtx(ctx);

    // ctx.plugin(onceBeforeConnect, logger);
    // ctx.plugin(onceConnect, logger);

    ctx.plugin(beforeCommand, logger);

    watchCtx.plugin(onGroupMemberDeleted, logger);

    ctx.on('connect', async () => {
        // test zone
        const messageId = 'me';
        const replyMessageId = 're';
        const userId = 'us';
        const groupId = 'gr';
        const channelId = 'ch';

        console.dir(await ctx.database.getGMR('messageId', { messageId }));
        console.dir(await ctx.database.getGMR('messageId', { messageId }, []));
        console.dir(
            await ctx.database.getGMR('messageId', { messageId }, ['groupId'])
        );

        console.dir(
            await ctx.database.getGMR('replyMessageId', { replyMessageId })
        );
        console.dir(
            await ctx.database.getGMR('replyMessageId', { replyMessageId }, [])
        );
        console.dir(
            await ctx.database.getGMR('replyMessageId', { replyMessageId }, [
                'replyMessageId',
            ])
        );

        console.dir(
            await ctx.database.getGMR('union', { userId, groupId, channelId })
        );
        console.dir(
            await ctx.database.getGMR(
                'union',
                { userId, groupId, channelId },
                []
            )
        );
        console.dir(
            await ctx.database.getGMR('union', { userId, groupId, channelId }, [
                'messageId',
                'content',
            ])
        );

        console.dir(await ctx.database.getGMR('messageId', { messageId: '1' }));
        console.dir(await ctx.database.getUser('onebot', '1'));
    });
};

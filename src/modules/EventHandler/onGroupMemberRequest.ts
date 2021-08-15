import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config from '../../utils';

export function onGroupMemberRequest(ctx: Context, logger: Logger) {
    ctx.on('group-member-request', async session => {
        const answer = /答案：(.*?)$/.exec(session.content!)![1];

        // const replyMessageId = await session.bot.sendMessage(
        //     Config.Onebot.motGroup,
        //     'gmr'
        // );
        await ctx.database.createGMR(session, '1', answer);
    });
}

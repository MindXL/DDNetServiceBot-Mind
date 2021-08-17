import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';

import Config, {
    parseGMRSession,
    sendGMRReminder,
    wrapGetPlayerPointsMsg,
} from '../../utils';

export function onGroupMemberRequest(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('group-member-request');

    ctx.on('group-member-request', async session => {
        try {
            // TODO: 加个如果一个群里已经有这个玩家了直接同意的功能 by Ts

            const answer =
                /答案：(.*?)$/.exec(session.content!)?.[1] ?? session.userId!;
            const gmr = parseGMRSession(session, answer);

            // 如果一个群里已经有这个玩家了直接同意
            for (const groupId of Config.Onebot.watchGroups) {
                if (groupId === gmr.groupId) continue;
                if (
                    Object.keys(
                        await session.bot.getGroupMemberMap(groupId)
                    ).includes(gmr.userId)
                ) {
                    // autoAgreeGMR(session.bot as CQBot, gmr,groupId);
                    await session.bot.handleGroupMemberRequest(
                        gmr.messageId,
                        true
                    );

                    const alreadyInGroup = await session.bot.getGroup(groupId);
                    const targetGroup = await session.bot.getGroup(gmr.groupId);
                    const seperate = '-'.repeat(15) + '\n';
                    const pointsMessage = await wrapGetPlayerPointsMsg(
                        gmr.answer
                    );

                    await session.bot.sendMessage(
                        Config.Onebot.motGroup,
                        '$自动同意了入群申请$\n\n' +
                            `申请人：${gmr.userId}\n\n` +
                            `所在群：${groupId}\n` +
                            `${alreadyInGroup.groupName}\n\n` +
                            `目标群：${targetGroup.groupId}\n` +
                            `${targetGroup.groupName}\n\n` +
                            seperate +
                            (gmr.answer === gmr.userId
                                ? '$用户未提供答案，使用QQ号查询分数$\n'
                                : '') +
                            `${pointsMessage}\n` +
                            seperate.slice(0, -1)
                    );
                    return;
                }
            }

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
            logger.error(e);
        }
    });
}

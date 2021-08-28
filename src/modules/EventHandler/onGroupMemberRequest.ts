import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import _ from 'lodash';

import Config, {
    parseGMRSession,
    sendGMRReminder,
    wrapGetPlayerPointsMsg,
    findIfGMRNoPoints,
    GMRCache,
} from '../../utils';
import { GroupMemberRequest } from '../../MysqlExtends';

export function onGroupMemberRequest(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('group-member-request');

    ctx.on('group-member-request', async session => {
        let gmr: GroupMemberRequest = {} as any;
        try {
            const answer =
                /答案：(.*?)$/.exec(session.content!)?.[1] ?? session.userId!;
            gmr = parseGMRSession(session, answer);
            const sendToMot = async (msg: string) =>
                session.bot.sendMessage(Config.Onebot.motGroup, msg);

            /* 如果一个群里已经有这个玩家了直接同意 */
            if (
                await (async () => {
                    const approvalMsg = await autoApproveGMR(
                        session.bot as CQBot,
                        gmr
                    );
                    if (approvalMsg) {
                        await sendToMot(approvalMsg);
                        return true;
                    }
                })()
            )
                return;

            // 发送入群申请提示消息
            const [replyMessageId, error] = await sendGMRReminder(
                session.bot as CQBot,
                gmr
            );
            if (error) throw new Error(error);
            Object.assign(gmr, { replyMessageId });

            // 由于各种原因产生的额外消息发送
            const extraMsgIds: any[] = [];

            /* 若player无分则执行find查找 */
            await (async () => {
                const findMsgs = await findIfGMRNoPoints(
                    gmr.answer ?? gmr.userId
                );
                if (Array.isArray(findMsgs) && findMsgs.length) {
                    const findMsgIds = [];
                    for (const msg of findMsgs) {
                        const findMsgId = await sendToMot(msg);
                        findMsgIds.push(findMsgId);
                    }
                    extraMsgIds.push(...findMsgIds);
                }
            })();

            extraMsgIds.length && Object.assign(gmr, { extraMsgIds });
        } catch (e) {
            logger.error(e);
        } finally {
            if (Object.keys(gmr).length) {
                await ctx.database.createGMR(gmr);
                GMRCache.push(gmr.replyMessageId);
            }
        }
    });
}

const autoApproveGMR = async (
    bot: CQBot,
    gmr: GroupMemberRequest
): Promise<string | undefined> => {
    for (const groupId of Config.Onebot.watchGroups) {
        if (groupId === gmr.groupId) continue;
        if (
            Object.keys(await bot.getGroupMemberMap(groupId)).includes(
                gmr.userId
            )
        ) {
            await bot.handleGroupMemberRequest(gmr.messageId, true);

            const alreadyInGroup = await bot.getGroup(groupId);
            const targetGroup = await bot.getGroup(gmr.groupId);
            const seperate = '-'.repeat(15) + '\n';
            const pointsMessage = await wrapGetPlayerPointsMsg(
                gmr.answer ?? gmr.userId
            );

            return (
                '$自动同意了入群申请$\n\n' +
                `申请人：${gmr.userId}\n\n` +
                `所在群：${groupId}\n` +
                `${alreadyInGroup.groupName}\n\n` +
                `目标群：${targetGroup.groupId}\n` +
                `${targetGroup.groupName}\n\n` +
                seperate +
                (gmr.answer ? '' : '$用户未提供答案，使用QQ号查询分数$\n') +
                `${pointsMessage}\n` +
                seperate.slice(0, -1)
            );
        }
    }
};

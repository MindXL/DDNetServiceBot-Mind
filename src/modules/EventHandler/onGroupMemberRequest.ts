import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import _ from 'lodash';

import Config, {
    parseGMRSession,
    sendGMRReminder,
    getPlayerData,
    wrapGetPlayerPointsMsg,
    getOnlinePlayerData,
    wrapFindMsg,
} from '../../utils';
import { GroupMemberRequest } from '../../MysqlExtends';

export function onGroupMemberRequest(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('group-member-request');

    ctx.on('group-member-request', async session => {
        try {
            const answer =
                /答案：(.*?)$/.exec(session.content!)?.[1] ?? session.userId!;
            const gmr = parseGMRSession(session, answer);
            const sendToMot = async (msg: string) =>
                session.bot.sendMessage(Config.Onebot.motGroup, msg);

            /* 如果一个群里已经有这个玩家了直接同意 */
            const approvalMsg = await autoApproveGMR(session.bot as CQBot, gmr);
            if (approvalMsg) {
                await sendToMot(approvalMsg);
                return;
            }

            // 发送入群申请提示消息
            const [replyMessageId, error] = await sendGMRReminder(
                session.bot as CQBot,
                gmr
            );
            Object.assign(gmr, {
                replyMessageId: replyMessageId ?? Config.GMRErrorReplyMessageId,
            });

            // 入群申请归档后再提示错误
            await ctx.database.createGMR(gmr);
            if (error) throw new Error(error);

            /* 若player无分则执行find查找 */
            const findMsgs = await ifNoPoints(gmr.answer);
            if (Array.isArray(findMsgs) && findMsgs.length) {
                for (const msg of findMsgs) {
                    await sendToMot(msg);
                }
            }
        } catch (e) {
            logger.error(e);
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
            const pointsMessage = await wrapGetPlayerPointsMsg(gmr.answer);

            return (
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
        }
    }
};

const ifNoPoints = async (name: string): Promise<string[] | undefined> => {
    if ((await getPlayerData(name))[0]?.points.points) return;

    const [data, error] = await getOnlinePlayerData(name);
    if (error) throw new Error(error);

    // pity type control
    if (data === null) throw new Error();

    const prefix = `${name}\n\n`;

    const { players: _players } = data;
    if (!_players.length) return [prefix + '该玩家目前不在线'];
    if (_players.length === 1) {
        const player = _players[0];
        return [
            prefix +
                wrapFindMsg(player) +
                '\n\n服务器ip：\n' +
                `${player.server.ip}:${player.server.port}`,
        ];
    }

    // player.server.locale !== 'as:cn' 则排在后面
    const players = _.sortBy(
        _players,
        player => player.server.locale !== 'as:cn'
    );

    const msgs: string[] = [];
    msgs.push(
        `共查找到${players.length}位在线玩家\n其中${
            players.length <= 3 ? players.length : 3
        }位如下：`
    );
    for (const player of players.slice(0, 3)) {
        msgs.push(
            prefix +
                wrapFindMsg(player) +
                '\n\n服务器ip：\n' +
                `${player.server.ip}:${player.server.port}`
        );
    }

    return msgs;
};

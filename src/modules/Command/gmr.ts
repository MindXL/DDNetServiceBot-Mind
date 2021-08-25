import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import _ from 'lodash';

import Config, {
    sendGMRReminder,
    findIfGMRNoPoints,
    GMRCache,
} from '../../utils';
import { GroupMemberRequest } from '../../MysqlExtends';

type DiffGMR = Pick<GroupMemberRequest, 'replyMessageId' | 'extraMsgIds'>;

export function gmr(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('points');

    ctx.command('gmr', '获取5条未处理的入群申请', { authority: 3 })
        .usage('(Group Member Request)')
        .action(async ({ session }) => {
            try {
                const gmrs = await ctx.database.getGMRByNum(5);
                if (Array.isArray(gmrs) && gmrs.length === 0)
                    return '$所有入群申请已被处理$';

                for (const gmr of gmrs) {
                    const diffGMR: DiffGMR = {} as any;

                    const [newReplyMessageId, error] = await sendGMRReminder(
                        session?.bot as CQBot,
                        gmr
                    );
                    if (error) throw new Error(error);
                    newReplyMessageId &&
                        Object.assign(diffGMR, {
                            replyMessageId: newReplyMessageId,
                        });

                    // 由于各种原因产生的额外消息发送
                    const newExtraMsgIds: any[] = [];

                    /* 若player无分则执行find查找 */
                    await (async () => {
                        const findMsgs = await findIfGMRNoPoints(
                            gmr.answer ?? gmr.userId
                        );
                        if (Array.isArray(findMsgs) && findMsgs.length) {
                            const findMsgIds = [];
                            for (const msg of findMsgs) {
                                const findMsgId =
                                    await session?.bot.sendMessage(
                                        session.groupId!,
                                        msg
                                    );
                                findMsgIds.push(findMsgId);
                            }
                            newExtraMsgIds.push(...findMsgIds);
                        }
                    })();

                    newExtraMsgIds.length &&
                        Object.assign(diffGMR, { extraMsgIds: newExtraMsgIds });

                    if (Object.keys(diffGMR).length) {
                        delete GMRCache[gmr.replyMessageId];
                        Object.assign(GMRCache, {
                            [diffGMR.replyMessageId]: { ...gmr, ...diffGMR },
                        });
                        await ctx.database.updateGMR(
                            'messageId',
                            { messageId: gmr.messageId },
                            diffGMR
                        );
                    }
                }
            } catch (e) {
                logger.error(e);
                return Config.UnknownErrorMsg;
            }
        });
}

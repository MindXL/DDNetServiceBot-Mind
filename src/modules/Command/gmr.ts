import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import _ from 'lodash';

import Config, { sendGMRReminder } from '../../utils';

export function gmr(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('points');

    ctx.command('gmr', '获取5条未处理的入群申请', { authority: 3 })
        .usage('(Group Member Request)')
        .action(async ({ session }) => {
            try {
                const gmrs = await ctx.database.getGMRByNum(5);
                if (Array.isArray(gmrs) && gmrs.length === 0)
                    return '$所有入群申请已被处理$';

                let errors: string[] = [];
                for (const gmr of gmrs) {
                    const [newReplyMessageId, error] = await sendGMRReminder(
                        session?.bot as CQBot,
                        gmr
                    );

                    if (newReplyMessageId) {
                        await ctx.database.updateGMR(
                            'messageId',
                            { messageId: gmr.messageId },
                            newReplyMessageId
                        );
                    } else {
                        errors.push(error!);
                    }
                }

                // 风控错误，无法发送消息，return nothing
                if (errors.length) return;
            } catch (e) {
                logger.error(e);
                return Config.UnknownErrorMsg;
            }
        });
}

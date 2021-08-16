import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import { CQBot } from 'koishi-adapter-onebot';
import _ from 'lodash';

import Config, { sendGMRReminder } from '../../utils';

export function gmr(ctx: Context, logger: Logger) {
    ctx.command('gmr', '获取5条未处理的入群申请', { authority: 3 })
        .usage('(Group Member Request)')
        .action(async ({ session }) => {
            try {
                session?.observeChannel;
                const gmrs = await ctx.database.getGMRByNum(5);
                if (Array.isArray(gmrs) && gmrs.length === 0)
                    return '$所有入群申请已被处理$';

                let errors: string[] = [];
                await Promise.all(
                    gmrs.map(async gmr => [
                        ...(await sendGMRReminder(session?.bot as CQBot, gmr)),
                        gmr.messageId,
                    ])
                ).then(results => {
                    results.map(
                        async ([newReplyMessageId, error, messageId]) => {
                            if (newReplyMessageId) {
                                await ctx.database.updateGMR(
                                    'messageId',
                                    { messageId: messageId! },
                                    newReplyMessageId
                                );
                            } else {
                                errors.push(error!);
                            }
                        }
                    );
                });
                // gmrs.map(async gmr => {
                //     const [newReplyMessageId, error] = await sendGMRReminder(
                //         session?.bot as CQBot,
                //         gmr
                //     );
                //     console.log(error?.slice(0, 10));

                //     if (newReplyMessageId) {
                //         await ctx.database.updateGMR(
                //             'messageId',
                //             { messageId: gmr.messageId },
                //             newReplyMessageId
                //         );
                //     } else {
                //         errors.push(error!);
                //     }
                // });

                console.log(errors);
                if (errors.length) throw new Error(errors[0]);
            } catch (e) {
                logger.extend('gmr').error(e);
                return Config.UnknownErrorMsg;
            }
        });
}

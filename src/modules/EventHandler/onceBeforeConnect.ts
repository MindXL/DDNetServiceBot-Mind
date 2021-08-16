import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config from '../../utils';

const { Onebot, Discord } = Config;

export function onceBeforeConnect(ctx: Context, logger: Logger) {
    ctx.once('before-connect', async () => {
        try {
            ['user', 'channel'].map(async table => {
                await ctx.database.mysql.query('TRUNCATE ??', [table]);
            });

            await ctx.database.createUser('onebot', Onebot.developer.onebot, {
                authority: 4,
                ...Onebot.developer,
                ...Discord.developer,
            });
            Onebot.moderators.map(
                async moderator =>
                    await ctx.database.createUser('onebot', moderator.onebot, {
                        authority: 3,
                        ...moderator,
                    })
            );
        } catch (e) {
            logger.extend('once@before#connect').error(e);
        }
    });
}

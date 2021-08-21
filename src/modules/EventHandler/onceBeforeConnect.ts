import { Context } from 'koishi-core';
import { Logger, sleep, Time } from 'koishi-utils';

import Config from '../../utils';

const { Onebot, Discord } = Config;

export function onceBeforeConnect(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('once@before#connect');

    ctx.once('before-connect', async () => {
        await sleep(Time.second * 10);
        try {
            for (const table of ['user', 'channel']) {
                await ctx.database.mysql.query('TRUNCATE ??', [table]);
            }

            await ctx.database.createUser('onebot', Onebot.developer.onebot, {
                authority: 4,
                ...Onebot.developer,
                ...Discord.developer,
            });

            for (const moderator of Onebot.moderators) {
                await ctx.database.createUser('onebot', moderator.onebot, {
                    authority: 3,
                    ...moderator,
                });
            }

            logger.success('reset mysql table `user`');
        } catch (e) {
            logger.error(e);
        }
    });
}

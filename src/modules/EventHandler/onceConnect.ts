import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config from '../../utils';

export function onceConnect(ctx: Context, logger: Logger) {
    ctx.once('connect', () => {
        try {
            ctx.bots.map(
                async bot =>
                    await bot.sendPrivateMessage(
                        (platform => {
                            switch (platform) {
                                case 'onebot':
                                    return Config.Onebot.developer.onebot;
                                case 'discord':
                                    return Config.Discord.developer.discord;
                                default:
                                    return '';
                            }
                        })(bot.platform),
                        `${bot.platform} bot is on.`
                    )
            );
        } catch (e) {
            logger.extend('once@connect').error(e);
        }
    });
}

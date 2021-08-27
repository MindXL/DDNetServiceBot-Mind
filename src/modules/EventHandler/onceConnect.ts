import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config from '../../utils';

export function onceConnect(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('once@connect');

    ctx.once('connect', async () => {
        try {
            for (const bot of ctx.bots) {
                const msg = `${bot.platform} bot is on.`;

                await bot.sendPrivateMessage(
                    (() => {
                        switch (bot.platform) {
                            case 'onebot':
                                return Config.Onebot.developer.onebot;
                            // case 'discord':
                            //     return Config.Discord.devPrivateChannel;
                            default:
                                return '';
                        }
                    })(),
                    msg
                );
            }
        } catch (e) {
            logger.error(e);
        }
    });
}

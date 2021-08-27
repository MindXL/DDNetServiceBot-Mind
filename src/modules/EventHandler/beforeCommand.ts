import { Context, Channel, User } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config from '../../utils';

export function beforeCommand(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('before#command');

    //@ts-ignore
    ctx.on('before-command', async ({ session }) => {
        try {
            const user = await ctx.database.getUser(
                session?.platform!,
                session?.userId!,
                ['authority']
            );

            // if (
            //     (Config.Onebot.watchGroups.includes(session?.groupId!) ||
            //         Config.Discord.watchChannels.includes(
            //             session?.channelId!
            //         )) &&
            //     user.authority < 3
            // )
            if (
                Config.Onebot.watchGroups.includes(session?.groupId!) &&
                user.authority < 3
            )
                return '';

            const author = session?.author;
            console.log(
                [
                    session?.platform,
                    `$${session?.subtype}$`,
                    session?.subtype === 'group'
                        ? `{${session?.groupId}} [${session?.channelId}] `
                        : '',
                    `(${author?.userId})`,
                    `\`${author?.nickname || author?.username}\``,
                    'calls command',
                    `\`${session?.content}\``,
                ]
                    .join(' ')
                    .replace(/\s{2,}/g, ' ')
            );
        } catch (e) {
            logger.error(e);
        }
    });
}

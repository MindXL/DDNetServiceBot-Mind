import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

export function beforeCommand(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('before#command');

    ctx.on('before-command', ({ session }) => {
        try {
            const author = session?.author;

            console.log(
                [
                    session?.platform,
                    `$${session?.subtype}$`,
                    session?.subtype === 'group'
                        ? `{${session?.groupId}} [${session?.channelId}] `
                        : '',
                    `(${author?.userId})`,
                    `\`${author?.nickname ?? author?.username}\``,
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

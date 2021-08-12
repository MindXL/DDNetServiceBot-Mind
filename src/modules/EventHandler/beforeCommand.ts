import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

export function beforeCommand(ctx: Context, logger: Logger) {
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
            logger.extend('before#command').error(e);
        }
    });
}

import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config, { wrapGetPlayerPointsMsg } from '../../utils';

export function points(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('points');

    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 }).action(
        async ({ session }, name) => {
            try {
                const author = session?.author;
                return await wrapGetPlayerPointsMsg(
                    name ?? author?.nickname ?? author?.username
                );
            } catch (e) {
                logger.error(e);
                return Config.UnknownErrorMsg;
            }
        }
    );
}

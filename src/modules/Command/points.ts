import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config, { wrapGetPlayerPointsMsg } from '../../utils';

export function points(ctx: Context, logger: Logger) {
    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 }).action(
        async (_, name) => {
            try {
                return await wrapGetPlayerPointsMsg(name);
            } catch (e) {
                logger.extend('points').error(e);
                return Config.UnknownErrorMsg;
            }
        }
    );
}

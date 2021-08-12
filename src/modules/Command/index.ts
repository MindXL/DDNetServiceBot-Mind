import { Context } from 'koishi';

import { getDevCtx, getMotCtx } from '../../utils';
import { dev } from './dev';
import { points } from './points';

module.exports.name = 'Command';

module.exports.points = points;

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('Command');

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    devCtx.plugin(dev, logger);
    // motCtx.plugin(recall, {});
    // motCtx.plugin(newmod);
    motCtx.plugin(points, logger);
    // motCtx.plugin(gmr);
    // motCtx.plugin(spot);
};

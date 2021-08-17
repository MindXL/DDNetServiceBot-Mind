import { Context } from 'koishi-core';

import { getDevCtx, getMotCtx } from '../../utils';
import { dev } from './dev';
import { points } from './points';
import { gmr } from './gmr';
import { newmod } from './newmod';

module.exports.name = 'Command';

module.exports.points = points;

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('Command');

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    devCtx.plugin(dev, logger);

    motCtx.select('platform', 'onebot').plugin(newmod, logger);
    motCtx.plugin(points, logger);
    motCtx.plugin(gmr, logger);
    // motCtx.plugin(spot);
};

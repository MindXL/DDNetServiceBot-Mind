import { Context } from 'koishi';

import { getDevCtx, getMotCtx } from '../utils/CustomFunc';

import { dev } from './commands/dev';
import { recall } from './commands/recall';
import { newmod } from './commands/newmod';
import { points } from './commands/points';
import { gmr } from './commands/gmr';
import { spot } from './commands/spot';

module.exports.name = 'Command';

module.exports.apply = (ctx: Context) => {
    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    devCtx.plugin(dev);

    motCtx.plugin(recall, {});
    motCtx.plugin(newmod);
    motCtx.plugin(points);
    motCtx.plugin(gmr);
    motCtx.plugin(spot);
};

import { Context } from 'koishi-core';

import { getDevCtx, getMotCtx } from '../../utils';
import { handleGMR } from './handleGMR';

module.exports.name = 'MessageHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('MessageHandler');

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    motCtx.plugin(handleGMR, logger);

    devCtx.middleware(async (session, next) => {
        if (session.content === 'et') {
        }
        return next();
    });
};

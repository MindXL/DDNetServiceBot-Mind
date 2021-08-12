import { Context } from 'koishi-core';

import { getDevCtx, getMotCtx } from '../../utils';

module.exports.name = 'MessageHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('MessageHandler');

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    // 回应"hh"消息
    devCtx.middleware(async (session, next) => {
        if (session.content === 'hh') {
            await session.send('surprise');
        }
        return next();
    });
};

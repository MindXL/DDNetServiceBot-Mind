import { Context } from 'koishi-core';

import { getPlayerData } from '../utils';

module.exports.name = 'Router';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('Router');

    ctx.router.get('/ddnet/players/:name', async (ctx, next) => {
        const [result, error] = await getPlayerData(ctx.params.name);
        ctx.body = result ?? error;
        return next();
    });

    ctx.router.get('/ddnet/maps/:map', (ctx, next) => {
        ctx.redirect(`https://api.mindxl.site/ddnet/maps/${ctx.params.map}`);
        return next();
    });
};

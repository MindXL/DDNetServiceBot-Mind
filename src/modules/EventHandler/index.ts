import { Context } from 'koishi-core';

import { getWatchCtx } from '../../utils';
import { onceBeforeConnect } from './onceBeforeConnect';
import { onceConnect } from './onceConnect';
import { beforeCommand } from './beforeCommand';
import { onGroupMemberDeleted } from './onGroupMemberDeleted';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('EventHandler');
    const watchCtx = getWatchCtx(ctx);

    // ctx.plugin(onceBeforeConnect, logger);
    // ctx.plugin(onceConnect, logger);

    ctx.plugin(beforeCommand, logger);

    watchCtx.plugin(onGroupMemberDeleted, logger);

    // ctx.on('message', session => {
    //     console.log(session);
    // });
};

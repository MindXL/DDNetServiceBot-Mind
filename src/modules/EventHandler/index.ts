import { Context } from 'koishi-core';

import { onceBeforeConnect } from './onceBeforeConnect';
import { beforeCommand } from './beforeCommand';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('EventHandler');

    // ctx.plugin(onceBeforeConnect, logger);
    ctx.plugin(beforeCommand, logger);

    // ctx.on('message', session => {
    //     console.log(session);
    // });
};

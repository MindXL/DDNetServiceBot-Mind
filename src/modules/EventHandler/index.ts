import { Context } from 'koishi-core';

import { getWatchCtx } from '../../utils';
import { onceBeforeConnect } from './onceBeforeConnect';
import { onceConnect } from './onceConnect';
import { beforeCommand } from './beforeCommand';
import { onGroupMemberRequest } from './onGroupMemberRequest';
import { onGroupMemberDeleted } from './onGroupMemberDeleted';
import { test } from './test';

import '../../MysqlExtends';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('EventHandler');
    const watchCtx = getWatchCtx(ctx);

    // ctx.plugin(onceBeforeConnect, logger);
    // ctx.plugin(onceConnect, logger);

    ctx.plugin(beforeCommand, logger);

    watchCtx.plugin(onGroupMemberRequest, logger);
    watchCtx.plugin(onGroupMemberDeleted, logger);

    ctx.plugin(test, logger);
};

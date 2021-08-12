import { Context, s } from 'koishi';

// import Config from '../utils/config';
import { getDevCtx, getMotCtx } from '../../utils';
import Config from '../../utils/config';
// import '../utils/MysqlExtends/Moderator';

module.exports.name = 'MessageHandler';

module.exports.apply = (ctx: Context) => {
    const logger = ctx.logger('MessageHandler');

    const devCtx = getDevCtx(ctx);
    const motCtx = getMotCtx(ctx);

    // 回应"hh"消息
    devCtx.middleware(async (session, next) => {
        if (session.content === 'hh') {
            console.log(session);
            await session.send(s('text', { content: 'surprise' }));
        }
        return next();
    });
};

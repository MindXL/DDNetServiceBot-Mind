import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config, { GMRCache } from '../../utils';
import { GroupMemberRequest } from '../../MysqlExtends';

export function onceConnect(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('once@connect');

    ctx.once('connect', async () => {
        try {
            // 向已登录的平台中的developer账号发送上线消息，以测试在各平台是否上线成功
            for (const bot of ctx.bots) {
                const msg = `${bot.platform} bot is on.`;

                await bot.sendPrivateMessage(
                    (() => {
                        switch (bot.platform) {
                            case 'onebot':
                                return Config.Onebot.developer.onebot;
                            // case 'discord':
                            //     return Config.Discord.devPrivateChannel;
                            default:
                                throw new Error();
                        }
                    })(),
                    msg
                );
            }

            // 载入数据库中已有的入群申请的replyMessageId，减少数据库请求
            const rawGMRs = (await ctx.database.mysql.query(
                'SELECT ?? FROM ??',
                ['replyMessageId', GroupMemberRequest.table]
            )) as Pick<GroupMemberRequest, 'replyMessageId'>[];
            GMRCache.push(...rawGMRs.map(gmr => gmr.replyMessageId));
        } catch (e) {
            logger.error(e);
        }
    });
}

import { Context } from 'koishi-core';
import { Logger, s } from 'koishi-utils';

import Config, { testPlayerName } from '../../utils';

export function newmod(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('newmod');

    const funnyReply = ['你再皮？', '皮？', '这孩子得用铁棍打一顿'];
    let count = 0;

    ctx.command('newmod <mod:user> <name:text>', '注册或修改管理员', {
        authority: 3,
    })
        .example('newmod @Mind Mind\n此处的@Mind不是文本')
        .check(async ({ session }, mod, name) => {
            const atSender = s('at', { id: session?.userId! });

            const onebot = /onebot:(\w+)/.exec(mod)?.[1];
            if (
                // @全体成员
                onebot === 'undefined' ||
                onebot === Config.Onebot.developer.onebot ||
                onebot === session?.selfId ||
                onebot === session?.userId
            ) {
                const msg = atSender + funnyReply[count];
                count++;
                if (count >= funnyReply.length) count = 0;
                return msg;
            } else if (!onebot || !/\d+/.test(onebot) || !name) {
                await session?.sendQueued(
                    atSender + '注册信息不规范！请查看如下说明！'
                );
                await session?.execute('help newmod');
                return '';
            }
            if (!testPlayerName(name))
                return atSender + Config.PlayerNameErrorMsg;
            // if(ctx.database.getUser('onebot'))
        })
        .action(async ({ session }, mod, name) => {
            try {
                const atSender = s('at', { id: session?.userId! });
                // 已在.check()中对数据有效性进行了判断
                const onebot = /onebot:(\d+)/.exec(mod)![1];

                // await ctx.database.setModerator('onebot', onebot!);
                const user = await ctx.database.getUser('onebot', onebot, [
                    'authority',
                ]);
                if (user) {
                    if (user.authority === 3) {
                        await session?.sendQueued(
                            '该用户已经是管理员了！此次指令是否要修改昵称？（y/...）'
                        );
                        const reply = await session?.prompt()!;
                        if (!reply) {
                            await session?.sendQueued(atSender + '输入超时。');
                            return;
                        }
                        if (/[yY]/.test(reply)) {
                            await ctx.database.setModerator('onebot', onebot, {
                                name,
                            });
                            await session?.sendQueued(
                                atSender + 'mod昵称修改为：\n' + name
                            );
                        } else {
                            await session?.sendQueued('newmod退出');
                        }
                    } else {
                        await ctx.database.setModerator('onebot', onebot, {
                            name,
                        });
                    }
                } else {
                    await ctx.database.createModerator('onebot', onebot, {
                        name,
                    });
                    await session?.sendQueued(
                        `注册成功！\n欢迎你，${s('at', { id: onebot })}`
                    );
                }
            } catch (e) {
                logger.error(e);
            }
        });
}

import { Context, s } from 'koishi';

import Config from '../../utils/config';
import { commandCheckUserName } from '../../utils/DDNetOrientedFunc';

export function newmod(ctx: Context) {
    ctx.command('newmod <mod:user> <name:text>', '注册新管理员', {
        authority: 4,
    })
        .usage('注意：昵称一定要使用单引号包裹！\n')
        .example("newmod @Mind 'Mind'\n此处的@Mind不是一串文本")
        .check((_, mod, name) => commandCheckUserName(name))
        .action(async ({ session }, mod, name) => {
            console.log(mod);
            console.log(name);
            const atSender = s('at', { id: session?.userId! });
            // koishi已存在对数据格式的内部判断
            const onebot = /onebot:(?<onebot>\d+)/.exec(mod)?.groups?.onebot;

            if (
                onebot === undefined ||
                onebot === session?.selfId ||
                onebot === Config.developer.onebot ||
                name === undefined
            ) {
                session?.sendQueued(
                    atSender + '注册信息不规范！请查看如下说明！'
                );
                session?.execute('help newmod');
                return;
            }

            const user = await ctx.database.getUser('onebot', onebot);
            if (user !== undefined) {
                if (user.authority === 3) {
                    session?.sendQueued(
                        '该用户已经是管理员了！此次指令是否要修改昵称？（y/...）'
                    );
                    const reply = await session?.prompt()!;
                    if (!reply) {
                        session?.sendQueued(atSender + '输入超时。');
                        return;
                    }
                    if (/[yY]/.test(reply)) {
                        ctx.database.setModerator('onebot', onebot, {
                            name: name,
                        });
                        session?.sendQueued(
                            atSender + 'mod昵称修改为：\n' + name
                        );
                    } else {
                        session?.sendQueued('newmod退出');
                    }

                    return;
                } else {
                    ctx.database.setUser('onebot', onebot, {
                        name: name,
                        authority: 3,
                    });
                }
            } else {
                ctx.database.createModerator({ onebot: onebot, name: name });
            }
            session?.send(`注册成功！\n欢迎你，${s('at', { id: onebot })}！`);
        });
}

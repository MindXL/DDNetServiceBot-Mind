import { Context } from 'koishi';

import { commandCheckUserName, getPoints } from '../../utils/DDNetOrientedFunc';

export function points(ctx: Context) {
    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 })
        .check((_, name) => commandCheckUserName(name))
        .action(async ({ session }, name) => {
            return await getPoints(
                name ??
                    (session?.author?.nickname !== ''
                        ? session?.author?.nickname
                        : session?.username),
                ctx.logger('Command').extend('points')
            );
        });
}

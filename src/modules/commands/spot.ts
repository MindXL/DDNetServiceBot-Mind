import { Context, s } from 'koishi';
import { resolve } from 'path';
import _ from 'lodash';

import { commandCheckUserName, find } from '../../utils/DDNetOrientedFunc';

export function spot(ctx: Context) {
    const logger = ctx.logger('Command').extend('spot');

    const spot = ctx.command('spot', '（Seek-Locate-Destroy）');

    spot.subcommand('client', '查看client信息').action(async ({ session }) => {
        session?.send(
            s('image', {
                file: 'file://' + resolve(__dirname, '../static/client.jpg'),
            })
        );
    });

    spot.subcommand('find <name:text>', '查找在线状态')
        .option('noDetail', '-n')
        .check((_, name) => commandCheckUserName(name))
        .action(async ({ session, options }, name) => {
            find(session!, name, logger, options?.noDetail);
        });
}

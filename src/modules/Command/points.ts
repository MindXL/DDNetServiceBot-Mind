import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';

import Config, { testPlayerName, wrapGetPlayerMsg } from '../../utils';

export function points(ctx: Context, logger: Logger) {
    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 })
        .check((_, name) =>
            testPlayerName(name) ? void 0 : Config.PlayerNameErrorMsg
        )
        .action(async ({ session }, name) => {
            const result = await wrapGetPlayerMsg(name);
            return (result[1] ?? result[0])!;
        });
}

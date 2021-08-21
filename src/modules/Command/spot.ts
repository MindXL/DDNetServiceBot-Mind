import { Context } from 'koishi-core';
import { Logger, s } from 'koishi-utils';
import _ from 'lodash';

import Config, {
    testPlayerName,
    getOnlinePlayerData,
    wrapFindMsg,
} from '../../utils';
import { FindDataPlayer } from '../../lib';

export function spot(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('spot');

    const spot = ctx.command('spot', '（Seek-Locate-Destroy）');

    spot.subcommand('find <name:text>', '查找在线状态')
        .check((_, name) =>
            testPlayerName(name) ? void 0 : Config.PlayerNameErrorMsg
        )
        .action(async ({ session }, name) => {
            try {
                const [data, error] = await getOnlinePlayerData(name);
                if (error) throw new Error(error);

                // pity type control
                if (data === null) throw new Error();

                const prefix = `${name}\n\n`;
                const { players } = data;
                if (!players.length) return prefix + '该玩家目前不在线';
                if (players.length === 1) {
                    const player = players[0];
                    await session?.sendQueued(
                        prefix +
                            wrapFindMsg(player) +
                            '\n\n（服务器ip地址单独显示）'
                    );
                    await session?.sendQueued(
                        `${player.server.ip}:${player.server.port}`
                    );
                    return;
                }

                const atSender = s('at', { id: session?.userId! });
                const seperate = '-'.repeat(15) + '\n';
                const finishMsg = '$find查看完毕$';

                // 按 players[i].server.locale === 'as:cn' 分组
                const { true: domestic, false: foreign } = _.groupBy(
                    players,
                    player => player.server.locale === 'as:cn'
                );
                const goOnWith = async (players: FindDataPlayer[]) => {
                    for (const player of players) {
                        await session?.sendQueued(
                            prefix +
                                wrapFindMsg(player) +
                                `\n${seperate}\n回复：\ny-继续查看\nip-获取服务器ip并结束对话\n（回复其它则结束对话）`
                        );

                        const reply = await session?.prompt()!;
                        if (/[yY]/.test(reply)) continue;
                        if (/ip/.test(reply))
                            await session?.sendQueued(
                                `${player.server.ip}:${player.server.port}`
                            );
                        return finishMsg;
                    }
                };

                if (domestic) {
                    await session?.sendQueued(
                        atSender +
                            `共查找到${players.length}位在线玩家\n其中有${domestic.length}位玩家位于CN\n首位如下：`
                    );
                    const msg = await goOnWith(domestic);
                    if (msg) return msg;
                } else {
                    await session?.sendQueued(
                        atSender +
                            '未查找到任何位于CN的在线玩家，是否显示其它在线重名玩家？（y/...）'
                    );
                    const reply = await session?.prompt()!;
                    if (!reply || !/[yY]/.test(reply)) return finishMsg;
                }

                // 此处foreign一定存在
                if (domestic) {
                    session?.sendQueued(
                        atSender +
                            '位于CN的玩家已显示完毕，是否显示其它在线重名玩家？（y/...）'
                    );
                    const reply = await session?.prompt()!;
                    if (!reply || !/[yY]/.test(reply)) return finishMsg;
                }
                const msg = await goOnWith(foreign);
                if (msg) return msg;

                return '$find查看完毕$';
            } catch (e) {
                logger.error(e);
                return Config.UnknownErrorMsg;
            }
        });
}

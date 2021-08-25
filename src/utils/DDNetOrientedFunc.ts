import { Session } from 'koishi-core';
import { CQBot } from 'koishi-adapter-onebot';
import axios, { AxiosError } from 'axios';
import _ from 'lodash';

import Config from './config';
import { byteLenth } from './CustomFunc';
import { PromiseResult, PlayerData, FindDataPlayer, FindData } from '../lib';
import { GroupMemberRequest } from '../MysqlExtends';

export function testPlayerName(name: string): boolean {
    const bytes = byteLenth(name);
    return 0 < bytes && bytes <= 15;
}

export async function getPlayerData(
    name: string
): Promise<PromiseResult<PlayerData>> {
    try {
        if (testPlayerName(name)) {
            const { data } = await axios(
                `https://${
                    process.env.DDNET_API
                }/ddnet/players/${encodeURIComponent(name)}.json`,
                {
                    headers: {
                        'accept-encoding': 'gzip, deflate',
                        decompress: true,
                    },
                }
            );
            return [data, null];
        } else {
            throw new Error(Config.PlayerNameErrorMsg);
        }
    } catch (e) {
        let message: string;

        if ((e as AxiosError).isAxiosError) {
            message =
                (e as AxiosError).response?.status === 404
                    ? Config.PlayerNotFoundMsg
                    : Config.UnknownErrorMsg;
        } else {
            message = (e as Error).message;
        }

        return [null, message];
    }
}

export async function wrapGetPlayerPointsMsg(name: string): Promise<string> {
    const [data, error] = await getPlayerData(name);

    let prefix = `${name}\n\n`;

    if (error) return prefix + error;

    // 排除error后data就一定存在
    // pity type control
    if (data === null) throw new Error();

    const favServer = _.maxBy(
        _.toPairs(_.groupBy(data.last_finishes, 'country')),
        '1.length'
    )?.[0];

    return (
        prefix +
        `${favServer}\n${data.points.rank}. with ${data.points.points} points`
    );
}

export function parseGMRSession(
    session: Session.Payload<'group-member-request'>,
    answer: string
): GroupMemberRequest {
    const gmr = {};
    _.map(session, (value, key) => {
        !GroupMemberRequest.excludeKeys.includes(key) &&
            Object.assign(gmr, { [key]: value });
    });
    // parse的时候还没有发送消息，因此replyMessageId不存在
    Object.assign(gmr, { answer });
    return gmr as GroupMemberRequest;
}

export async function sendGMRReminder(
    bot: CQBot,
    gmr: GroupMemberRequest
): Promise<PromiseResult<string>> {
    try {
        const targetGroup = await bot.getGroup(gmr.groupId);
        const seperate = '-'.repeat(15) + '\n';
        const pointsMessage = await wrapGetPlayerPointsMsg(
            gmr.answer ?? gmr.userId
        );

        const replyMessageId = await bot
            .sendMessage(
                Config.Onebot.motGroup,
                '$收到入群申请$\n\n' +
                    `申请人：${gmr.userId}\n\n` +
                    `目标群：${targetGroup.groupId}\n` +
                    `${targetGroup.groupName}\n\n` +
                    seperate +
                    (gmr.answer ? '' : '$用户未提供答案，使用QQ号查询分数$\n') +
                    `${pointsMessage}\n` +
                    seperate +
                    '\n回复此消息以处理入群申请\n（y/n/n [reason...]/i=忽略）'
            )
            .catch(e => [null, e.message] as PromiseResult<string>);
        /* 发现账号风控，此时不能发送消息 */
        return Array.isArray(replyMessageId)
            ? replyMessageId
            : [replyMessageId, null];
    } catch (e) {
        // 风控错误不会出现在这里，可以发送消息
        await bot.sendMessage(
            Config.Onebot.motGroup,
            '$收到入群申请$\n\n出现非风控错误，入群申请已归档'
        );
        return [null, e.message];
    }
}

export async function findIfGMRNoPoints(
    name: string
): Promise<string[] | undefined> {
    if ((await getPlayerData(name))[0]?.points.points) return;

    const [data, error] = await getOnlinePlayerData(name);
    if (error) throw new Error(error);

    // pity type control
    if (data === null) throw new Error();

    const prefix = `${name}\n\n`;

    const { players: _players } = data;
    if (!_players.length) return [prefix + '该玩家目前不在线'];
    if (_players.length === 1) {
        const player = _players[0];
        return [
            prefix +
                wrapFindMsg(player) +
                '\n\n服务器ip：\n' +
                `${player.server.ip}:${player.server.port}`,
        ];
    }

    // player.server.locale !== 'as:cn' 则排在后面
    const players = _.sortBy(
        _players,
        player => player.server.locale !== 'as:cn'
    );

    const msgs: string[] = [];
    msgs.push(
        `共查找到${players.length}位在线玩家\n其中${
            players.length <= 3 ? players.length : 3
        }位如下：`
    );
    for (const player of players.slice(0, 3)) {
        msgs.push(
            prefix +
                wrapFindMsg(player) +
                '\n\n服务器ip：\n' +
                `${player.server.ip}:${player.server.port}`
        );
    }

    return msgs;
}

export async function getOnlinePlayerData(
    name: string
): Promise<PromiseResult<FindData>> {
    try {
        if (testPlayerName(name)) {
            const { data }: { data: FindData } = await axios(
                `https://${
                    process.env.DDNET_API
                }/servers/players?name=${encodeURIComponent(name)}&detail=true`,
                {
                    headers: {
                        'accept-encoding': 'gzip',
                    },
                }
            );
            return [data, null];
        } else {
            throw new Error(Config.PlayerNameErrorMsg);
        }
    } catch (e) {
        return [
            null,
            (e as AxiosError).isAxiosError ? Config.UnknownErrorMsg : e.message,
        ];
    }
}

export function wrapFindMsg(player: FindDataPlayer) {
    const { server } = player;
    return `${
        player.clan === '' ? '(no clan)' : 'clan：' + player.clan
    }\n\n位于${server.locale}服务器：\n${server.name}\n\nmap：${server.map}`;
}

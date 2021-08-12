import { Logger, s } from 'koishi';
import { CQBot } from 'koishi-adapter-onebot';
import axios, { AxiosError } from 'axios';
import _ from 'lodash';

import Config from './config';
import { byteLenth } from './CustomFunc';
import { PlayerData } from './TsFreddieAPIInterface';
import { Session } from 'koishi';
import { PromiseResult } from './declares';

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
                `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
                    name
                )}.json`,
                {
                    headers: {
                        'accept-encoding': 'gzip, deflate',
                        decompress: true,
                    },
                }
            );
            console.dir(data);
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

export async function wrapGetPlayerMsg(
    name: string
): Promise<PromiseResult<string>> {
    try {
        const [data, error] = await getPlayerData(name);
        if (error) throw new Error(error);
        // 排除error后data就一定存在
        // pity type control
        if (data === null) throw new Error();

        let result = '';
        const points = data.points.points;
        result += points.toString();

        return [result, null];
    } catch (e) {
        return [null, (e as Error).message];
    }

    // let result = `${name}\n\n`;
    // try {
    //     if (testPlayerName(name)) {
    //         const { data }: { data: PointsData } = await axios(
    //             `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
    //                 name
    //             )}.json`,
    //             {
    //                 headers: {
    //                     'accept-encoding': 'gzip, deflate',
    //                     decompress: true,
    //                 },
    //             }
    //         );
    //         // 若该玩家不存在，则直接404错误跳出到catch
    //         const favServer = _.maxBy(
    //             _.toPairs(_.groupBy(data.last_finishes, 'country')),
    //             '1.length'
    //         )?.[0];
    //         result += `${favServer}\n${data.points.rank}. with ${data.points.points} points`;
    //     } else {
    //         result += `${Config.noPlayerMsg}\n${Config.ddnetUsernameErrorMsg}`;
    //     }
    // } catch (e) {
    //     if (e.response.status === 404) {
    //         result +=
    //             e?.response?.data?.error ??
    //             Config.noPlayerMsg ??
    //             Config.unknownErrorMsg;
    //     } else {
    //         // logger?.extend('getPoints').error(e);
    //         result += Config.unknownErrorMsg;
    //     }
    // }
    // return result;
}

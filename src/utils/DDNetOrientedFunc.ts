import axios, { AxiosError } from 'axios';
import _ from 'lodash';

import Config from './config';
import { byteLenth } from './CustomFunc';
import { PromiseResult, PlayerData } from '../lib';

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
                    'api.mindxl.site' ?? 'api.teeworlds.cn'
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

    let msg = `${name}\n\n`;

    if (error) return msg + error;

    // 排除error后data就一定存在
    // pity type control
    if (data === null) throw new Error();

    const favServer = _.maxBy(
        _.toPairs(_.groupBy(data.last_finishes, 'country')),
        '1.length'
    )?.[0];

    msg += `${favServer}\n${data.points.rank}. with ${data.points.points} points`;

    return msg;
}

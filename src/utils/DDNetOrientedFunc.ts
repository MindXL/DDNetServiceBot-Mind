import { CQBot } from 'koishi-adapter-onebot';
import axios from 'axios';

import Config from './config';

export async function getPoints(name: string): Promise<string> {
    let result = `${name}\n\n`;

    try {
        const { data } = await axios(
            `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
                name
            )}`,
            {
                headers: {
                    'accept-encoding': 'gzip',
                },
            }
        );

        result += `${data.points.rank}. with ${data.points.points} points`;
    } catch (e) {
        result += e?.response?.data?.error ?? '$出现未知错误';
    }
    return result;
}

export async function ifExists(name: string): Promise<boolean> {
    try {
        await axios(
            `https://api.teeworlds.cn/ddnet/players/${encodeURIComponent(
                name
            )}`,
            {
                headers: {
                    'accept-encoding': 'gzip',
                },
            }
        );
        return true;
    } catch (e) {
        return false;
    }
}

// export async function getOnePoints(name: string, n: number): Promise<string> {
//     if (!(await ifExists(name))) return `${name}\n\n该玩家不存在`;
//     try {
//         const { data } = await axios.get(
//             `https://ddnet.tw/players/${encodeURIComponent(name)}/`
//         );

//         const results = new RegExp(
//             `<div class="block2 ladder"><h3>(?<title>.*?)<[/]h3>\\n<p class="pers-result">(?<points>((\\d+). with (\\d+) points)|(Unranked))<[/]p><[/]div>`,
//             'g'
//         );

//         while (n > 0) {
//             results.exec(data);
//             n -= 1;
//         }

//         const result = results.exec(data)?.groups;

//         if (result) {
//             return `${name}\n\n${result.title}\n${result.points}`;
//         } else {
//             throw new Error();
//         }
//     } catch (e) {
//         return '$出现未知错误';
//     }
// }

// export async function ifExists(name: string): Promise<boolean> {
//     try {
//         const { data } = await axios.get('https://ddnet.tw/players/', {
//             params: { query: encodeURIComponent(name) },
//         });
//         if (data) {
//             for (const element of data) {
//                 if (element.name === name) return true;
//             }
//         }
//         return false;
//     } catch {
//         return false;
//     }
// }

export async function sendGMRReminder(
    bot: CQBot,
    userId: string,
    groupId: string,
    answer: string
): Promise<string> {
    const targetGroup = await bot.getGroup(groupId);
    const seperate = '-'.repeat(30);

    const newReplyMessageId = await bot.sendGroupMessage(
        Config.motGroup,
        `$收到入群申请$\n\n申请人：${userId}\n\n目标群：${
            targetGroup.groupId
        }\n${targetGroup.groupName}\n\n${seperate}\n${
            answer ? await getPoints(answer) : userId
        }\n${seperate}\n\n回复此消息以处理入群申请\n（y/n/n [reason...]/i=忽略）`
    );
    return newReplyMessageId;
}
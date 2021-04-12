import { Context, Time, sleep } from 'koishi';
import axios from 'axios';

import Config from './config';

module.exports.name = 'Command';

module.exports.apply = (_ctx: Context) => {
    const ctx = _ctx;

    ctx.command('eco <message:text>', '输出收到的信息', { authority: 1 })
        .option('encode', '-e 输出编码（encode）后的信息')
        .option('decode', '-d 输出解码（decode）后的信息')
        .option('timeout', '-t [seconds:number] 设定延迟发送的时间')
        .usage('注意：参数请写在最前面，不然会被当成 message 的一部分！\n')
        .example('eho -t 300 Hello World  五分钟后发送 Hello World')
        .alias('say')
        .shortcut('说话', { args: ['会说话了'] })
        .shortcut('说鬼话', { options: { encode: true }, fuzzy: true })
        .shortcut('说人话', { options: { decode: true }, fuzzy: true })
        .check(({ options }, message) =>
            options?.encode ? encodeURI(message) : void 0
        )
        .check(({ options }, message) =>
            options?.decode ? decodeURI(message) : void 0
        )
        .action(async ({ options }, message) => {
            if (options?.timeout) await sleep(options.timeout * Time.second);
            return message;
        });

    ctx.command('b <content:_text>', '广播', { authority: 4 })
        .alias('broadcast^')
        .shortcut('广播', { fuzzy: true })
        .action(async ({ session }, content) => {
            await session?.bot.broadcast([Config.testGroup], content);
            return '广播结束';
        });

    ctx.command('points [name:text]', '查询ddr分数', {
        authority: 1,
    }).action(({ session }, name) =>
        getOnePoints(name ?? session?.username, 0)
    );
};

async function getOnePoints(name: string, n: number): Promise<string> {
    return await new Promise((resolve, reject) => {
        axios
            .get(`https://ddnet.tw/players/${encodeURI(name)}/`)
            .then((value) => {
                const { data } = value;

                const results = new RegExp(
                    `<div class="block2 ladder"><h3>(?<title>.*?)<[/]h3>\\n<p class="pers-result">(?<points>((\\d+). with (\\d+) points)|(Unranked))<[/]p><[/]div>`,
                    'g'
                );

                while (n > 0) {
                    results.exec(data);
                    n -= 1;
                }

                const result = results.exec(data)?.groups;

                result
                    ? resolve(`${name}\n\n${result?.title}\n${result?.points}`)
                    : reject();
            })
            .catch(async (reason) => {
                resolve(
                    await new Promise((resolve, reject) => {
                        axios
                            .get(
                                `https://ddnet.tw/players/?query=${encodeURI(
                                    name
                                )}`
                            )
                            .then((value) => {
                                // 为空列表或模糊搜索到了其他名下数据
                                // typeof value.data !== 'undefined'
                                //     ? resolve(`${name}\n\n该用户不存在`)
                                //     : reject();

                                if (typeof value.data !== 'undefined') {
                                    resolve(`${name}\n\n该用户不存在`);
                                } else {
                                    throw new Error();
                                }
                            })
                            .catch((reason) => {
                                resolve('$ 出现错误\n$ Error');
                            });
                    })
                );
            });
    });
}

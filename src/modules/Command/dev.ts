import { Context } from 'koishi-core';
import { Logger, Time, sleep } from 'koishi-utils';

export function dev(ctx: Context, _logger: Logger) {
    const logger = _logger.extend('dev');

    const dev = ctx.command('dev', 'Developer Commands');

    dev.subcommand('echo <message:text>', '输出收到的信息', { authority: 1 })
        .option('encode', '-e 输出编码（encode）后的信息')
        .option('decode', '-d 输出解码（decode）后的信息')
        .option('timeout', '-t [seconds:number] 设定延迟发送的时间')
        .usage('注意：参数请写在最前面，不然会被当成 message 的一部分！\n')
        .example('eho -t 300 Hello World  五分钟后发送 Hello World')
        .alias('say')
        .shortcut('说话', { args: ['会说话了'] })
        .shortcut('说鬼话', { options: { encode: true }, fuzzy: true })
        .shortcut('说人话', { options: { decode: true }, fuzzy: true })
        .check(({ options }, message) => {
            if (options?.encode) return encodeURIComponent(message);
            if (options?.decode) return decodeURIComponent(message);
        })
        .action(async ({ options }, message) => {
            if (options?.timeout) await sleep(options.timeout * Time.second);
            return message;
        });

    dev.subcommand('clean', '清除数据库表`user`中的无效用户', {
        authority: 4,
    }).action(async ({ session }) => {
        try {
            /**do not understand (did not succeed)
             * await session?.database.remove('user', {
             *     onebot: { $eq: undefined },
             *     discord: { $eq: undefined },
             * });
             */

            const mysql = session?.database.mysql;
            const result: { affectedRows: number } = await mysql?.query(
                'DELETE FROM `user` WHERE ' +
                    ctx.bots
                        .map(bot => {
                            return `${mysql?.escapeId(
                                bot.platform
                            )} IS ${mysql?.escape(undefined)}`;
                        })
                        .join(' AND ')
            )!;
            await session?.sendQueued(
                `$清理了${result.affectedRows}位无效用户$`
            );
        } catch (e) {
            logger.extend('clean').error(e);
        }
    });

    dev.subcommand('reg', '测试正则表达式')
        .option('regex', '-r [regex:string] 指定正则表达式')
        .option('string', '-s [string:string] 指定字符串')
        .action(async ({ options }) => {
            const _regex = '([yY]|(?:[nN]|[nN] (?<reason>.*))|[iI])$';
            const _string = '';

            const regex = new RegExp(options?.regex ?? _regex);
            const string = options?.string ?? _string;
            const result = regex.exec(string);
            // console.log(result);
            return result?.toString();
        });
}

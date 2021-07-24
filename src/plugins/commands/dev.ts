import { Context, Time, sleep, s } from 'koishi';

import Config from '../../utils/config';

export function dev(ctx: Context) {
    //const logger = ctx.logger('Command').extend('dev');
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

    dev.subcommand('reg', '测试正则表达式')
        .option('regex', '-r [regex:text] 指定正则表达式')
        .option('string', '-s [string:text] 指定字符串')
        .action(async ({ options }) => {
            const _regex = '([yY]|(?:[nN]|[nN] (?<reason>.*))|[iI])$';
            const _string = '';

            const regex = new RegExp(options?.regex ?? _regex, 'g');
            const string = options?.string ?? _string;
            const result = regex.exec(string);
            console.log(result);
        });

    dev.subcommand('ct').action(async ({ session }) => {
        // session?.send('CommandTest');
        const bot = session!.bot;
        // console.log(await bot.getGroupMemberList(Config.motGroup))

        for (const member of await bot.getGroupMemberList(Config.motGroup)) {
            const _session = bot.createSession({
                type: 'send',
                subtype: 'group',
                platform: 'onebot',
                selfId: member.userId,
                groupId: Config.motGroup,
                channelId: Config.motGroup,
            });
            try {
                for (let i = 0; i < 15; i++) {
                    await _session.sendQueued(
                        `${member.userId}\n${i.toString()}\n${s('at', {
                            type: 'all',
                            // id: Config.developer.onebot,
                        })}`
                    );
                }
            } catch (e) {
                console.log(e);
            }
        }
    });
}

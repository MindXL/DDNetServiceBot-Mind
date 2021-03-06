import { Session, User } from 'koishi-core';
import './MysqlExtends';

require('dotenv').config('../.env');
import Config, { autoAssign, autoAuthorize } from './utils';

// const proxyInfo = process.env
//     .PROXY!.match(/(\w+):\/\/([\w.]+):(\d+)/)
//     ?.slice(1, 4)!;

// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
    port: process.env.PORT,

    bots: [
        {
            type: 'onebot:ws',
            // 对应 cqhttp 配置项 ws_config.port
            server: 'ws://localhost:6700',
            selfId: Config.Onebot.selfId,
            token: process.env.BOT_AUTH_TOKEN,
        },
        // {
        //     type: 'discord',
        //     token: process.env.DISCORD_TOKEN,
        // },
    ],

    // onebot: {
    //     secret: '',
    // },
    // discord: {
    //     axiosConfig: {
    //         proxy: {
    //             protocol: proxyInfo[0],
    //             host: proxyInfo[1],
    //             port: parseInt(proxyInfo[2]),
    //             auth: {
    //                 username: process.env.PROXY_USERNAME!,
    //                 password: process.env.PROXY_PASSWORD!,
    //             },
    //         },
    //     },
    // },

    // prefix: ['%', '&', '*'],
    prefix: '%',

    autoAssign: (session: Session) => autoAssign(session),
    autoAuthorize: (session: Session) => autoAuthorize(session),
    processMessage: (message: string) => message,

    plugins: {
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQLDB,
        },
        webui: {},
        common: {
            admin: false,
            bind: false,
            broadcast: false,
            callme: false,
            echo: false,
            // feedback
            // operator: `onebot:${Config.Onebot.developer.onebot}`,

            contextify: true,
            recall: true,

            // 处理事件
            onFriendRequest: false,
            async onGroupRequest(session: Session) {
                // 只通过所有来自 4 级或以上权限用户的加群邀请
                return (
                    (await session.observeUser(['authority' as keyof User]))
                        .authority >= 4
                );
            },

            // 跨频道消息转发
            // relay: [
            //     {
            //         source: `onebot:${Config.Onebot.modGroup}`,
            //         destination: `discord:${Config.Discord.modChannel}`,
            //     },
            //     {
            //         source: `discord:${Config.Discord.modChannel}`,
            //         destination: `onebot:${Config.Onebot.modGroup}`,
            //     },
            // ],
        },
        // schedule: {},
        tools: {
            baidu: true,
            brainfuck: false,
            // bilibili: false,
            crypto: false,
            magi: false,
            maya: false,
            mcping: false,
            music: false,
            oeis: false,
            qrcode: true,
            weather: false,
        },
        './modules/Command': {},
        './modules/EventHandler': {},
        './modules/MessageHandler': {},
        './modules/Router': {},
    },

    logTime: 'MM/dd hh:mm',

    watch: {
        // 要监听的根目录，相对于工作路径
        root: './**/*.js',
        // 要忽略的文件列表，支持 glob patterns
        ignore: ['node_modules'],
    },
};

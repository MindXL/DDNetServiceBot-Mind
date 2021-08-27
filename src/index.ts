import { App, Session, User } from 'koishi-core';
import { Logger } from 'koishi-utils';
import 'koishi-adapter-onebot';
import './MysqlExtends';

require('dotenv').config('../.env');
import Config, { autoAssign, autoAuthorize } from './utils';

const app = new App({
    port: parseInt(process.env.PORT!),
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: Config.Onebot.selfId,
            token: process.env.BOT_AUTH_TOKEN,
        },
    ],

    prefix: '%',
    autoAssign: (session: Session) => autoAssign(session),
    autoAuthorize: (session: Session) => autoAuthorize(session),
    processMessage: (message: string) => message,
});

app.plugin(require('koishi-plugin-mysql'), {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQLDB,
});
app.plugin(require('koishi-plugin-webui'));
app.plugin(require('koishi-plugin-common'), {
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
});
app.plugin(require('koishi-plugin-puppeteer'));
// app.plugin(require('koishi-plugin-schedule'));
app.plugin(require('koishi-plugin-tools'), {
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
});
app.plugin(require('./modules/Command'));
app.plugin(require('./modules/EventHandler'));
app.plugin(require('./modules/MessageHandler'));
app.plugin(require('./modules/Router'));

Logger.showTime = 'MM/dd hh:mm';

app.start();

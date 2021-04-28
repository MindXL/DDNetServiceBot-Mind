import { Session } from 'koishi';

import Config from './utils/config';
import { ifInGroups } from './utils/CustomFunc';

// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
    // Koishi 服务器监听的端口
    port: 8080,

    onebot: {
        secret: '',
    },

    bots: [
        {
            type: 'onebot:ws',
            // 对应 cqhttp 配置项 ws_config.port
            server: 'ws://localhost:6700',
            selfId: new Number(Config.selfId),
            token: 'MindBot',
        },
    ],

    prefix: ['%', '&', '*'],

    autoAssign: (session: Session) =>
        ifInGroups(session.groupId as string, [
            Config.testGroup,
            ...Config.watchGroups,
        ]),
    autoAuthorize: (session: Session) =>
        ifInGroups(session.groupId as string, [
            Config.testGroup,
            ...Config.watchGroups,
        ])
            ? 1
            : 0,

    plugins: {
        // mysql: {
        //   host: '127.0.0.1',
        //   port: 3306,
        //   user: 'root',
        //   password: '1634300602Wx-',
        //   database: 'koishi',
        // },
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '1634300602Wx-',
            database: '_koishi',
        },
        common: {},
        './modules/AppManage': {},
        './modules/Command': {},
        './modules/UserManage': {},
        './modules/EventHandler': {},
        './modules/MessageHandler': {},
    },

    // logTime: true,

    watch: {
        // 要监听的根目录，相对于工作路径
        root: './*/*.js',
        // 要忽略的文件列表，支持 glob patterns
        ignore: ['node_modules'],
    },
};

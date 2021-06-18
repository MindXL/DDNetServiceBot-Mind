import { Session } from 'koishi';

import Config from './utils/config';
import { autoAssign, autoAuthorize } from './utils/CustomFunc';

// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
    port: 8081,

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

    autoAssign: (session: Session) => autoAssign(session),
    autoAuthorize: (session: Session) => autoAuthorize(session),

    plugins: {
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '1634300602Wx-',
            database: Config.mysqlDB,
        },
        // common: {
        //     // 基础指令
        //     broadcast: false,
        //     contextify: false,
        //     recall: false,

        //     feedback: false,
        //     // operator: 'onebot:1634300602',

        //     // 处理好友申请
        //     onFriendRequest: false,

        //     // 数据管理
        //     callme: false,
        //     bind: false,
        //     authorize: false,
        //     assign: false,
        //     user: false,
        //     channel: false,
        // },
        './modules/AppManage': {},
        './modules/Command': {},
        './modules/EventHandler': {},
        './modules/MessageHandler': {},
        './modules/UserManage': {},
    },

    // logLevel: 3,
    logTime: true,

    watch: {
        // 要监听的根目录，相对于工作路径
        root: './*/*.js',
        // 要忽略的文件列表，支持 glob patterns
        ignore: ['node_modules'],
    },
};

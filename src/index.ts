import { App, Session } from 'koishi';
import 'koishi-adapter-onebot';

import Config from './utils/config';
import { ifInGroups } from './utils/CustomFunc';

const app = new App({
    port: 8080,
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: Config.selfId,
            token: 'MindBot',
        },
    ],
    prefix: ['%', '$', ''],
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
});

app.plugin(require('koishi-plugin-mysql'), {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1634300602Wx-',
    database: Config.mysqlDB,
});
app.plugin(require('koishi-plugin-common'));

app.plugin(require('./modules/AppManage'));
app.plugin(require('./modules/Command'));
app.plugin(require('./modules/UserManage'));
app.plugin(require('./modules/EventHandler'));
app.plugin(require('./modules/MessageHandler'));

app.start();

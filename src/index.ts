import { App, Session } from 'koishi';
import 'koishi-adapter-onebot';

import Config from './utils/config';
import { autoAssign, autoAuthorize } from './utils/CustomFunc';

const app = new App({
    port: 8081,
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: Config.selfId,
            token: 'MindBot',
        },
    ],
    prefix: ['%', '$', '*'],
    autoAssign: (session: Session) => autoAssign(session),
    autoAuthorize: (session: Session) => autoAuthorize(session),
});

app.plugin(require('koishi-plugin-mysql'), {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1634300602Wx-',
    database: Config.mysqlDB,
});

// app.plugin(require('koishi-plugin-common'));

app.plugin(require('./plugins/AppManage'));
app.plugin(require('./plugins/Command'));
app.plugin(require('./plugins/EventHandler'));
app.plugin(require('./plugins/MessageHandler'));
app.plugin(require('./plugins/UserManage'));

app.start();

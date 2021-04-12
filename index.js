"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var koishi_1 = require("koishi");
require("koishi-adapter-onebot");
var app = new koishi_1.App({
    port: 8080,
    bots: [
        {
            type: 'onebot:ws',
            selfId: '1066974992',
            server: 'ws://localhost:6700',
        },
    ],
    prefix: ['%', '$', ''],
});
app.plugin(require('koishi-plugin-common'));
app.plugin(require('./AppManage'));
app.plugin(require('./Command'));
app.plugin(require('./UserManage'));
app.plugin(require('./EventEmitter'));
app.plugin(require('./MessageHandler'));
app.start();

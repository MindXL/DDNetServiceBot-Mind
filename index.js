"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koishi_1 = require("koishi");
require("koishi-adapter-onebot");
var config_1 = __importDefault(require("./utils/config"));
var CustomFunc_1 = require("./utils/CustomFunc");
var app = new koishi_1.App({
    port: 8081,
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: config_1.default.selfId,
            token: 'MindBot',
        },
    ],
    prefix: ['%', '$', '*'],
    autoAssign: function (session) { return CustomFunc_1.autoAssign(session); },
    autoAuthorize: function (session) { return CustomFunc_1.autoAuthorize(session); },
});
app.plugin(require('koishi-plugin-mysql'), {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1634300602Wx-',
    database: config_1.default.mysqlDB,
});
app.plugin(require('./modules/AppManage'));
app.plugin(require('./modules/Command'));
app.plugin(require('./modules/EventHandler'));
app.plugin(require('./modules/MessageHandler'));
app.plugin(require('./modules/UserManage'));
app.start();

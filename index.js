"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koishi_1 = require("koishi");
require("koishi-adapter-onebot");
var config_1 = __importDefault(require("./utils/config"));
var CustomFunc_1 = require("./utils/CustomFunc");
var app = new koishi_1.App({
    port: 8080,
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: config_1.default.selfId,
            token: 'MindBot',
        },
    ],
    prefix: ['%', '$', ''],
    autoAssign: function (session) {
        return CustomFunc_1.ifInGroups(session.groupId, __spreadArray([
            config_1.default.testGroup
        ], config_1.default.watchGroups));
    },
    autoAuthorize: function (session) {
        return CustomFunc_1.ifInGroups(session.groupId, __spreadArray([
            config_1.default.testGroup
        ], config_1.default.watchGroups))
            ? 1
            : 0;
    },
});
app.plugin(require('koishi-plugin-mysql'), {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1634300602Wx-',
    database: config_1.default.mysqlDB,
});
app.plugin(require('koishi-plugin-common'));
app.plugin(require('./modules/AppManage'));
app.plugin(require('./modules/Command'));
app.plugin(require('./modules/UserManage'));
app.plugin(require('./modules/EventHandler'));
app.plugin(require('./modules/MessageHandler'));
app.start();

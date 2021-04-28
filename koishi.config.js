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
var config_1 = __importDefault(require("./utils/config"));
var CustomFunc_1 = require("./utils/CustomFunc");
module.exports = {
    port: 8080,
    onebot: {
        secret: '',
    },
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: new Number(config_1.default.selfId),
            token: 'MindBot',
        },
    ],
    prefix: ['%', '&', '*'],
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
    plugins: {
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
    watch: {
        root: './*/*.js',
        ignore: ['node_modules'],
    },
};

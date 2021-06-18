"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("./utils/config"));
var CustomFunc_1 = require("./utils/CustomFunc");
module.exports = {
    port: 8081,
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
    autoAssign: function (session) { return CustomFunc_1.autoAssign(session); },
    autoAuthorize: function (session) { return CustomFunc_1.autoAuthorize(session); },
    plugins: {
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '1634300602Wx-',
            database: config_1.default.mysqlDB,
        },
        './modules/AppManage': {},
        './modules/Command': {},
        './modules/EventHandler': {},
        './modules/MessageHandler': {},
        './modules/UserManage': {},
    },
    logTime: true,
    watch: {
        root: './*/*.js',
        ignore: ['node_modules'],
    },
};

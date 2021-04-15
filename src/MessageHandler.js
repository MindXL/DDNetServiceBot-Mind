"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koishi_1 = require("koishi");
require("koishi-adapter-onebot");
var config_1 = __importDefault(require("./config"));
module.exports.name = 'MessageHandler';
module.exports.apply = function (_ctx) {
    var ctx = _ctx;
    // 回应"hh"消息
    ctx.middleware(function (session, next) {
        if (session.content === 'hh') {
            session.send('surprise');
        }
        return next();
    });
    // 回应@消息
    ctx.middleware(function (session, next) {
        // 仅当接收到的消息包含了对机器人的称呼时才继续处理（比如消息以 @机器人 开头）
        if (session.content === 'segment') {
            return session.send('是你在叫我吗？');
        }
        else {
            // 如果去掉这一行，那么不满足上述条件的消息就不会进入下一个中间件了
            return next();
        }
    });
    // // 同一消息连续发送3次则复读一次
    var times = 0; // 复读次数
    var message = 'm'; // 当前消息
    ctx.middleware(function (session, next) {
        if (session.content === message) {
            times += 1;
            if (times === 3)
                return session.send(message);
        }
        else {
            times = 0;
            message = session.content;
            return next();
        }
    }, true /* true 表示这是前置中间件 */);
    ctx.middleware(function (session, next) {
        if (session.content === 'hlep') {
            // 如果该 session 没有被截获，则这里的回调函数将会被执行
            return next(function () { return session.send('你想说的是 help 吗？'); });
        }
        else {
            return next();
        }
    });
    ctx.middleware(function (session, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!((_a = session.parsed) === null || _a === void 0 ? void 0 : _a.appel)) return [3 /*break*/, 6];
                    // @某某用户 我在叫你哟！
                    return [4 /*yield*/, session.sendQueued(koishi_1.segment('at', { id: config_1.default.mainQQ }) + '我在叫你哟！')];
                case 1:
                    // @某某用户 我在叫你哟！
                    _b.sent();
                    // 你发送了一张 Koishi 图标
                    return [4 /*yield*/, session.sendQueued(koishi_1.segment('image', { url: 'https://koishi.js.org/koishi.png' }))];
                case 2:
                    // 你发送了一张 Koishi 图标
                    _b.sent();
                    return [4 /*yield*/, session.sendQueued(koishi_1.segment('anonymous') + '这是一条匿名消息。')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, session.sendQueued(koishi_1.segment('quote', { id: config_1.default.mainQQ }) + '这是一条回复消息。')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, session.cancelQueued()];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/, next()];
            }
        });
    }); });
    ctx.middleware(function (session, next) { return __awaiter(void 0, void 0, void 0, function () {
        var name_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(session.content === 'login')) return [3 /*break*/, 3];
                    return [4 /*yield*/, session.send('请输入用户名：')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, session.prompt()];
                case 2:
                    name_1 = _a.sent();
                    if (!name_1)
                        return [2 /*return*/, session.send('输入超时。')];
                    // 执行后续操作
                    return [2 /*return*/, session.send(name_1 + "\uFF0C\u8BF7\u591A\u6307\u6559\uFF01")];
                case 3: return [2 /*return*/, next()];
            }
        });
    }); });
};

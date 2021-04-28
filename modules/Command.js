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
var config_1 = __importDefault(require("../utils/config"));
var DDNetOrientedFunc_1 = require("../utils/DDNetOrientedFunc");
module.exports.name = 'Command';
module.exports.apply = function (ctx) {
    var testCtx = config_1.default.getTestCtx(ctx);
    var motCtx = config_1.default.getMotCtx(ctx);
    testCtx
        .command('eco <message:text>', '输出收到的信息', { authority: 1 })
        .option('encode', '-e 输出编码（encode）后的信息')
        .option('decode', '-d 输出解码（decode）后的信息')
        .option('timeout', '-t [seconds:number] 设定延迟发送的时间')
        .usage('注意：参数请写在最前面，不然会被当成 message 的一部分！\n')
        .example('eho -t 300 Hello World  五分钟后发送 Hello World')
        .alias('say')
        .shortcut('说话', { args: ['会说话了'] })
        .shortcut('说鬼话', { options: { encode: true }, fuzzy: true })
        .shortcut('说人话', { options: { decode: true }, fuzzy: true })
        .check(function (_a, message) {
        var options = _a.options;
        return (options === null || options === void 0 ? void 0 : options.encode) ? encodeURI(message) : void 0;
    })
        .check(function (_a, message) {
        var options = _a.options;
        return (options === null || options === void 0 ? void 0 : options.decode) ? decodeURI(message) : void 0;
    })
        .action(function (_a, message) {
        var options = _a.options;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(options === null || options === void 0 ? void 0 : options.timeout)) return [3, 2];
                        return [4, koishi_1.sleep(options.timeout * koishi_1.Time.second)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2, message];
                }
            });
        });
    });
    testCtx
        .command('b <content:_text>', '广播', { authority: 4 })
        .alias('broadcast^')
        .shortcut('广播', { fuzzy: true })
        .action(function (_a, content) {
        var session = _a.session;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, (session === null || session === void 0 ? void 0 : session.bot.broadcast([config_1.default.testGroup], content))];
                    case 1:
                        _b.sent();
                        return [2, '广播结束'];
                }
            });
        });
    });
    motCtx
        .command('points [name:text]', '查询ddr分数')
        .action(function (_a, name) {
        var session = _a.session;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, DDNetOrientedFunc_1.getPoints(name !== null && name !== void 0 ? name : (((_b = session === null || session === void 0 ? void 0 : session.author) === null || _b === void 0 ? void 0 : _b.nickname) !== ''
                            ? (_c = session === null || session === void 0 ? void 0 : session.author) === null || _c === void 0 ? void 0 : _c.nickname
                            : session === null || session === void 0 ? void 0 : session.username))];
                    case 1: return [2, _d.sent()];
                }
            });
        });
    });
    motCtx
        .command('gmr', '(Group Member Request)\n获取5条未处理的入群申请')
        .action(function (_a) {
        var session = _a.session;
        return __awaiter(void 0, void 0, void 0, function () {
            var gmrs, _i, gmrs_1, gmr, newReplyMessageId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, motCtx.database.getGMRs_N(5)];
                    case 1:
                        gmrs = _b.sent();
                        if (Array.isArray(gmrs) && gmrs.length === 0)
                            return [2, '$所有入群申请已被处理$'];
                        _i = 0, gmrs_1 = gmrs;
                        _b.label = 2;
                    case 2:
                        if (!(_i < gmrs_1.length)) return [3, 6];
                        gmr = gmrs_1[_i];
                        return [4, DDNetOrientedFunc_1.sendGMRReminder(session.bot, gmr.userId, gmr.groupId, gmr.content)];
                    case 3:
                        newReplyMessageId = _b.sent();
                        return [4, ctx.database.updateGMR('messageId', gmr.messageId, newReplyMessageId)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3, 2];
                    case 6: return [2];
                }
            });
        });
    });
    testCtx.command('cdelete').action(function (_a) {
        var session = _a.session;
        return __awaiter(void 0, void 0, void 0, function () {
            var channelId, mId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channelId = session === null || session === void 0 ? void 0 : session.channelId;
                        return [4, (session === null || session === void 0 ? void 0 : session.bot.sendMessage(channelId, 'pre'))];
                    case 1:
                        mId = (_b.sent());
                        return [4, koishi_1.sleep(4 * koishi_1.Time.minute)];
                    case 2:
                        _b.sent();
                        session === null || session === void 0 ? void 0 : session.bot.deleteMessage(channelId, mId);
                        return [2];
                }
            });
        });
    });
    testCtx.command('ct').action(function (_a) {
        var session = _a.session;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                session === null || session === void 0 ? void 0 : session.send('CommandTest');
                return [2];
            });
        });
    });
};

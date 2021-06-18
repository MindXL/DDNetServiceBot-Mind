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
var koishi_core_1 = require("koishi-core");
var path_1 = require("path");
var config_1 = __importDefault(require("../utils/config"));
var CustomFunc_1 = require("../utils/CustomFunc");
var DDNetOrientedFunc_1 = require("../utils/DDNetOrientedFunc");
module.exports.name = 'Command';
module.exports.apply = function (ctx) {
    var devCtx = CustomFunc_1.getDevCtx(ctx);
    var motCtx = CustomFunc_1.getMotCtx(ctx);
    devCtx.plugin(eco);
    devCtx.plugin(reg);
    motCtx.plugin(recall, {});
    motCtx.plugin(newmod);
    motCtx.plugin(points);
    motCtx.plugin(gmr);
    motCtx.plugin(spot);
    devCtx.plugin(cTest);
};
function eco(ctx) {
    var _this = this;
    ctx.command('echo <message:text>', '输出收到的信息', { authority: 1 })
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
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(options === null || options === void 0 ? void 0 : options.timeout)) return [3, 2];
                        return [4, koishi_core_1.sleep(options.timeout * koishi_core_1.Time.second)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2, message];
                }
            });
        });
    });
}
function reg(ctx) {
    var _this = this;
    ctx.command('reg', '测试正则表达式')
        .option('regex', '-r [regex:text] 指定正则表达式')
        .option('string', '-s [string:text] 指定字符串')
        .action(function (_a) {
        var options = _a.options;
        return __awaiter(_this, void 0, void 0, function () {
            var _regex, _string, regex, string, result;
            var _b, _c;
            return __generator(this, function (_d) {
                _regex = '([yY]|(?:[nN]|[nN] (?<reason>.*))|[iI])$';
                _string = '';
                regex = new RegExp((_b = options === null || options === void 0 ? void 0 : options.regex) !== null && _b !== void 0 ? _b : _regex, 'g');
                string = (_c = options === null || options === void 0 ? void 0 : options.string) !== null && _c !== void 0 ? _c : _string;
                result = regex.exec(string);
                console.log(result);
                return [2];
            });
        });
    });
}
function newmod(ctx) {
    var _this = this;
    ctx.command('newmod <mod:user> <name:text>', '注册新管理员', {
        authority: 4,
    })
        .usage('注意：昵称一定要使用单引号包裹！\n')
        .example("newmod @Mind 'Mind'\n此处的@Mind不是一串文本")
        .check(function (_, name) { return DDNetOrientedFunc_1.commandCheckUserName(name); })
        .action(function (_a, mod, name) {
        var session = _a.session;
        return __awaiter(_this, void 0, void 0, function () {
            var atSender, onebot, user, reply;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        atSender = koishi_core_1.s('at', { id: session === null || session === void 0 ? void 0 : session.userId });
                        if (!DDNetOrientedFunc_1.testUserName(name)) {
                            session === null || session === void 0 ? void 0 : session.sendQueued(atSender + '参数name超过15个字节');
                            return [2];
                        }
                        onebot = (_c = (_b = /onebot:(?<onebot>\d+)/.exec(mod)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.onebot;
                        if (onebot === undefined ||
                            onebot === (session === null || session === void 0 ? void 0 : session.selfId) ||
                            onebot === config_1.default.developer.onebot ||
                            name === undefined) {
                            session === null || session === void 0 ? void 0 : session.sendQueued(atSender + '注册信息不规范！请查看如下说明！');
                            session === null || session === void 0 ? void 0 : session.execute('help newmod');
                            return [2];
                        }
                        return [4, ctx.database.getUser('onebot', onebot)];
                    case 1:
                        user = _d.sent();
                        if (!(user !== undefined)) return [3, 5];
                        if (!(user.authority === 3)) return [3, 3];
                        session === null || session === void 0 ? void 0 : session.sendQueued('该用户已经是管理员了！此次指令是否要修改昵称？（y/...）');
                        return [4, (session === null || session === void 0 ? void 0 : session.prompt())];
                    case 2:
                        reply = _d.sent();
                        if (!reply) {
                            session === null || session === void 0 ? void 0 : session.sendQueued(atSender + '输入超时。');
                            return [2];
                        }
                        if (/[yY]/.test(reply)) {
                            ctx.database.setModerator('onebot', onebot, {
                                name: name,
                            });
                            session === null || session === void 0 ? void 0 : session.sendQueued(atSender + 'mod昵称修改为：\n' + name);
                        }
                        else {
                            session === null || session === void 0 ? void 0 : session.sendQueued('newmod退出');
                        }
                        return [2];
                    case 3:
                        ctx.database.setUser('onebot', onebot, {
                            name: name,
                            authority: 3,
                        });
                        _d.label = 4;
                    case 4: return [3, 6];
                    case 5:
                        ctx.database.createModerator({ onebot: onebot, name: name });
                        _d.label = 6;
                    case 6:
                        session === null || session === void 0 ? void 0 : session.send("\u6CE8\u518C\u6210\u529F\uFF01\n\u6B22\u8FCE\u4F60\uFF0C" + koishi_core_1.s('at', { id: onebot }) + "\uFF01");
                        return [2];
                }
            });
        });
    });
}
function recall(ctx, _a) {
    var _this = this;
    var _b = _a.recallCount, recallCount = _b === void 0 ? 10 : _b;
    ctx = ctx.group();
    var recent = {};
    ctx.on('send', function (session) {
        var _a;
        var list = (recent[_a = session.channelId] || (recent[_a] = []));
        list.unshift(session.messageId);
        if (list.length > recallCount) {
            list.pop();
        }
    });
    ctx.command('recall [count:number]', '撤回 bot 发送的消息', {
        authority: 3,
    }).action(function (_a, count) {
        var session = _a.session;
        if (count === void 0) { count = 1; }
        return __awaiter(_this, void 0, void 0, function () {
            var list, removal, delay, index, error_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        list = recent[session === null || session === void 0 ? void 0 : session.channelId];
                        if (!list)
                            return [2, '近期没有发送消息。'];
                        removal = list.splice(0, count);
                        delay = (_c = (_b = ctx.app) === null || _b === void 0 ? void 0 : _b.options.delay) === null || _c === void 0 ? void 0 : _c.broadcast;
                        if (!list.length)
                            delete recent[session === null || session === void 0 ? void 0 : session.channelId];
                        index = 0;
                        _d.label = 1;
                    case 1:
                        if (!(index < removal.length)) return [3, 7];
                        if (!(index && delay)) return [3, 3];
                        return [4, koishi_core_1.sleep(delay)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4, (session === null || session === void 0 ? void 0 : session.bot.deleteMessage(session === null || session === void 0 ? void 0 : session.channelId, removal[index]))];
                    case 4:
                        _d.sent();
                        return [3, 6];
                    case 5:
                        error_1 = _d.sent();
                        ctx.logger('bot').warn(error_1);
                        return [3, 6];
                    case 6:
                        index++;
                        return [3, 1];
                    case 7: return [2];
                }
            });
        });
    });
}
function points(ctx) {
    var _this = this;
    ctx.command('points [name:text]', '查询ddr分数', { authority: 3 })
        .check(function (_, name) { return DDNetOrientedFunc_1.commandCheckUserName(name); })
        .action(function (_a, name) {
        var session = _a.session;
        return __awaiter(_this, void 0, void 0, function () {
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, DDNetOrientedFunc_1.getPoints(name !== null && name !== void 0 ? name : (((_b = session === null || session === void 0 ? void 0 : session.author) === null || _b === void 0 ? void 0 : _b.nickname) !== ''
                            ? (_c = session === null || session === void 0 ? void 0 : session.author) === null || _c === void 0 ? void 0 : _c.nickname
                            : session === null || session === void 0 ? void 0 : session.username), ctx.logger('points'))];
                    case 1: return [2, _d.sent()];
                }
            });
        });
    });
}
function gmr(ctx) {
    var _this = this;
    ctx.command('gmr', '获取5条未处理的入群申请', { authority: 3 })
        .usage('(Group Member Request)')
        .action(function (_a) {
        var session = _a.session;
        return __awaiter(_this, void 0, void 0, function () {
            var gmrs, _i, gmrs_1, gmr_1, newReplyMessageId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, ctx.database.getGMRs_N(5)];
                    case 1:
                        gmrs = _b.sent();
                        if (Array.isArray(gmrs) && gmrs.length === 0)
                            return [2, '$所有入群申请已被处理$'];
                        _i = 0, gmrs_1 = gmrs;
                        _b.label = 2;
                    case 2:
                        if (!(_i < gmrs_1.length)) return [3, 6];
                        gmr_1 = gmrs_1[_i];
                        return [4, DDNetOrientedFunc_1.sendGMRReminder(session.bot, gmr_1.userId, gmr_1.groupId, gmr_1.content, ctx.logger('points'))];
                    case 3:
                        newReplyMessageId = _b.sent();
                        return [4, ctx.database.updateGMR(gmr_1.messageId, newReplyMessageId)];
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
}
function spot(ctx) {
    var _this = this;
    var logger = ctx.logger('Command').extend('spot');
    var spot = ctx.command('spot', '（Seek-Locate-Destroy）');
    spot.subcommand('client', '查看client信息').action(function (_a) {
        var session = _a.session;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                session === null || session === void 0 ? void 0 : session.send(koishi_core_1.s('image', {
                    file: 'file://' + path_1.resolve(__dirname, '../static/client.jpg'),
                }));
                return [2];
            });
        });
    });
    spot.subcommand('find <name:text>', '查找在线状态')
        .option('noDetail', '-n')
        .check(function (_, name) { return DDNetOrientedFunc_1.commandCheckUserName(name); })
        .action(function (_a, name) {
        var session = _a.session, options = _a.options;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                DDNetOrientedFunc_1.find(session, name, logger, options === null || options === void 0 ? void 0 : options.noDetail);
                return [2];
            });
        });
    });
}
function cTest(ctx) {
    var _this = this;
    ctx.command('ct').action(function (_a) {
        var session = _a.session;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2];
            });
        });
    });
}

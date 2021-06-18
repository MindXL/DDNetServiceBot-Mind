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
var config_1 = __importDefault(require("../utils/config"));
var CustomFunc_1 = require("../utils/CustomFunc");
var DDNetOrientedFunc_1 = require("../utils/DDNetOrientedFunc");
require("../utils/MysqlExtends/GroupMemberRequest");
module.exports.name = 'EventHandler';
module.exports.apply = function (ctx) {
    var devCtx = CustomFunc_1.getDevCtx(ctx);
    var watchCtx = CustomFunc_1.getWatchCtx(ctx);
    var logger = ctx.logger('EventHandler');
    ctx.once('before-connect', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _i, _b, moderator, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, ctx.database.getModerator('onebot', config_1.default.developer.onebot)];
                case 1:
                    _a = (_d.sent());
                    if (_a) return [3, 3];
                    return [4, ctx.database.createUser('onebot', config_1.default.developer.onebot, config_1.default.developer)];
                case 2:
                    _a = (_d.sent());
                    _d.label = 3;
                case 3:
                    _a;
                    _i = 0, _b = config_1.default.moderators;
                    _d.label = 4;
                case 4:
                    if (!(_i < _b.length)) return [3, 9];
                    moderator = _b[_i];
                    return [4, ctx.database.getModerator('onebot', moderator.onebot)];
                case 5:
                    _c = (_d.sent());
                    if (_c) return [3, 7];
                    return [4, ctx.database.createModerator(moderator)];
                case 6:
                    _c = (_d.sent());
                    _d.label = 7;
                case 7:
                    _c;
                    _d.label = 8;
                case 8:
                    _i++;
                    return [3, 4];
                case 9: return [2];
            }
        });
    }); });
    ctx.before('command', function (_a) {
        var session = _a.session, command = _a.command;
        try {
            var author = session === null || session === void 0 ? void 0 : session.author;
            if ((session === null || session === void 0 ? void 0 : session.subtype) === 'group') {
                console.log('{%s} [%s] `%s` %s calls command `%s`', session === null || session === void 0 ? void 0 : session.channelId, author === null || author === void 0 ? void 0 : author.userId, author === null || author === void 0 ? void 0 : author.username, (author === null || author === void 0 ? void 0 : author.nickname) ? '(`' + (author === null || author === void 0 ? void 0 : author.nickname) + '`) ' : '', command === null || command === void 0 ? void 0 : command.name);
            }
            else if ((session === null || session === void 0 ? void 0 : session.subtype) === 'private') {
                console.log('{private} [%s] `%s` %s calls command `%s`', author === null || author === void 0 ? void 0 : author.userId, author === null || author === void 0 ? void 0 : author.username, (author === null || author === void 0 ? void 0 : author.nickname) ? '(`' + (author === null || author === void 0 ? void 0 : author.nickname) + '`) ' : '', command === null || command === void 0 ? void 0 : command.name);
            }
        }
        catch (e) {
            logger.extend('before-command').error(e);
        }
    });
    watchCtx.on('group-member-request', function (session) { return __awaiter(void 0, void 0, void 0, function () {
        var answer, groupId, userId, replyMessageId, set;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    answer = /答案：(.*?)$/.exec(session.content)[1];
                    groupId = session.groupId;
                    userId = session.userId;
                    return [4, DDNetOrientedFunc_1.sendGMRReminder(session.bot, userId, groupId, answer, ctx.logger('points'))];
                case 1:
                    replyMessageId = _a.sent();
                    if (!replyMessageId) return [3, 7];
                    set = {
                        userId: session.userId,
                        groupId: session.groupId,
                        channelId: session.channelId,
                    };
                    return [4, ctx.database.getGMR('union', set)];
                case 2:
                    if (!_a.sent()) return [3, 4];
                    return [4, ctx.database.setGMR('union', set, session, replyMessageId)];
                case 3:
                    _a.sent();
                    return [3, 6];
                case 4: return [4, ctx.database.createGMR(session, replyMessageId)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3, 8];
                case 7:
                    session.send('$Event On GMR出现未知错误，请联系Mind处理$\n错误标号：points/getPoints');
                    _a.label = 8;
                case 8: return [2];
            }
        });
    }); });
    watchCtx.on('group-member-deleted', function (session) { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = session.userId;
                    return [4, ctx.database.remove('user', { onebot: [userId] })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    ctx.on('friend-request', function (session) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, session.bot.handleFriendRequest(session.messageId, false)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    devCtx.on('message', function (session) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (session.content === 'et') {
            }
            return [2];
        });
    }); });
};

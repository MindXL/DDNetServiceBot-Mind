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
exports.sendGMRReminder = exports.find = exports.getPoints = exports.commandCheckUserName = exports.testUserName = void 0;
var koishi_1 = require("koishi");
var axios_1 = __importDefault(require("axios"));
var lodash_1 = __importDefault(require("lodash"));
var config_1 = __importDefault(require("./config"));
var CustomFunc_1 = require("./CustomFunc");
function testUserName(name) {
    var bytes = CustomFunc_1.byteLenth(name);
    return 0 < bytes && bytes <= 15;
}
exports.testUserName = testUserName;
function commandCheckUserName(name) {
    return testUserName(name) ? void 0 : config_1.default.ddnetUsernameErrorMsg;
}
exports.commandCheckUserName = commandCheckUserName;
function getPoints(name, logger) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var result, data, favServer, e_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    result = name + "\n\n";
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, , 6]);
                    if (!testUserName(name)) return [3, 3];
                    return [4, axios_1.default("https://api.teeworlds.cn/ddnet/players/" + encodeURIComponent(name) + ".json", {
                            headers: {
                                'accept-encoding': 'gzip, deflate',
                                decompress: true,
                            },
                        })];
                case 2:
                    data = (_e.sent()).data;
                    if (data.player) {
                        favServer = (_a = lodash_1.default.maxBy(lodash_1.default.toPairs(lodash_1.default.groupBy(data.last_finishes, 'country')), '1.length')) === null || _a === void 0 ? void 0 : _a[0];
                        result += favServer + "\n" + data.points.rank + ". with " + data.points.points + " points";
                    }
                    else {
                        result += config_1.default.noPointsMsg;
                    }
                    return [3, 4];
                case 3:
                    result += config_1.default.noPointsMsg + "\n" + config_1.default.ddnetUsernameErrorMsg;
                    _e.label = 4;
                case 4: return [3, 6];
                case 5:
                    e_1 = _e.sent();
                    if (e_1.response.status === 404) {
                        result += (_d = (_c = (_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) !== null && _d !== void 0 ? _d : config_1.default.unknownErrorMsg;
                    }
                    else {
                        logger === null || logger === void 0 ? void 0 : logger.extend('getPoints').error(e_1);
                        result += config_1.default.unknownErrorMsg;
                    }
                    return [3, 6];
                case 6: return [2, result];
            }
        });
    });
}
exports.getPoints = getPoints;
function wrapFindMsg(player) {
    var server = player.server;
    return (player.clan === '' ? '(no clan)' : 'clan：' + player.clan) + "\n\n\u4F4D\u4E8E" + server.locale + "\u670D\u52A1\u5668\uFF1A\n" + server.name + "\n\nmap\uFF1A" + server.map;
}
function find(session, name, logger, noDetail) {
    return __awaiter(this, void 0, void 0, function () {
        var atSender, _result, result, toFind, data, players, player, lenth, seperate, i, j, countCN, player, reply, server, reply, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    atSender = koishi_1.s('at', { id: session === null || session === void 0 ? void 0 : session.userId });
                    if (!name) {
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender + 'find指令缺少参数name');
                        return [2];
                    }
                    else if (!testUserName(name)) {
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender + config_1.default.ddnetUsernameErrorMsg);
                        return [2];
                    }
                    _result = name + "\n\n";
                    result = _result;
                    toFind = 'as:cn';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, , 14]);
                    return [4, axios_1.default("https://api.teeworlds.cn/servers/players?name=" + encodeURIComponent(name) + "&detail=" + ((noDetail !== null && noDetail !== void 0 ? noDetail : false) ? 'false' : 'true'), {
                            headers: {
                                'accept-encoding': 'gzip',
                            },
                        })];
                case 2:
                    data = (_a.sent()).data;
                    players = data.players;
                    if (!(players.length === 0)) return [3, 3];
                    result += '该玩家目前不在线';
                    session === null || session === void 0 ? void 0 : session.sendQueued(result);
                    return [3, 12];
                case 3:
                    if (!(players.length === 1)) return [3, 4];
                    player = players[0];
                    result += wrapFindMsg(player);
                    session === null || session === void 0 ? void 0 : session.sendQueued(result);
                    return [3, 12];
                case 4:
                    lenth = players.length;
                    seperate = '-'.repeat(30);
                    i = 0, j = 0, countCN = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < lenth && j <= lenth)) return [3, 11];
                    while (j < lenth && players[j].server.locale !== toFind)
                        j++;
                    player = undefined;
                    if (!(i === 0)) return [3, 8];
                    if (!(j < lenth)) return [3, 6];
                    if (countCN === 0)
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender + ("\u67E5\u627E\u5230" + lenth + "\u4F4D\u73A9\u5BB6\uFF0C\u9996\u4F4D\u5982\u4E0B\uFF1A"));
                    countCN++;
                    player = players[j];
                    j++;
                    i--;
                    return [3, 8];
                case 6:
                    if (countCN) {
                        if (lenth - countCN > 0)
                            session === null || session === void 0 ? void 0 : session.sendQueued(atSender +
                                '位于CN的玩家已显示完毕，是否显示其它在线重名玩家？（y/...）');
                        else {
                            return [3, 11];
                        }
                    }
                    else {
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender +
                            '未查找到任何位于CN的玩家，是否显示其它在线重名玩家？（y/...）');
                    }
                    return [4, (session === null || session === void 0 ? void 0 : session.prompt())];
                case 7:
                    reply = _a.sent();
                    if (!reply) {
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender + '输入超时。');
                        return [2];
                    }
                    if (!/[yY]/.test(reply))
                        return [3, 11];
                    _a.label = 8;
                case 8:
                    player = player !== null && player !== void 0 ? player : players[i];
                    if (i !== -1 && j === lenth && player.server.locale === toFind)
                        return [3, 10];
                    server = player.server;
                    result += wrapFindMsg(player);
                    if (!(i < lenth)) return [3, 10];
                    result += "\n" + seperate + "\n\n\u56DE\u590D\uFF1A\ny-\u7EE7\u7EED\u67E5\u770B\nip-\u83B7\u53D6\u670D\u52A1\u5668ip\u5E76\u7ED3\u675F\u5BF9\u8BDD\n\uFF08\u56DE\u590D\u5176\u5B83\u5219\u7ED3\u675F\u5BF9\u8BDD\uFF09";
                    session === null || session === void 0 ? void 0 : session.sendQueued(result);
                    return [4, (session === null || session === void 0 ? void 0 : session.prompt())];
                case 9:
                    reply = _a.sent();
                    if (!reply) {
                        session === null || session === void 0 ? void 0 : session.sendQueued(atSender + '输入超时。');
                        return [2];
                    }
                    if (/[yY]/.test(reply)) {
                        result = _result;
                        return [3, 10];
                    }
                    else if (/ip/.test(reply)) {
                        session === null || session === void 0 ? void 0 : session.sendQueued(server.ip + ":" + server.port);
                        return [3, 11];
                    }
                    else
                        return [3, 11];
                    _a.label = 10;
                case 10:
                    i++;
                    return [3, 5];
                case 11:
                    session === null || session === void 0 ? void 0 : session.sendQueued('$find查看完毕$');
                    _a.label = 12;
                case 12: return [3, 14];
                case 13:
                    e_2 = _a.sent();
                    logger.extend('find').error(e_2);
                    session === null || session === void 0 ? void 0 : session.sendQueued(config_1.default.unknownErrorMsg);
                    return [3, 14];
                case 14: return [2];
            }
        });
    });
}
exports.find = find;
function sendGMRReminder(bot, userId, groupId, _answer, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var targetGroup, seperate, answer, pointsMessage, newReplyMessageId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, bot.getGroup(groupId)];
                case 1:
                    targetGroup = _a.sent();
                    seperate = '-'.repeat(30);
                    answer = _answer !== '' ? _answer : userId;
                    return [4, getPoints(answer, logger)];
                case 2:
                    pointsMessage = _a.sent();
                    return [4, bot.sendGroupMessage(config_1.default.motGroup, "$\u6536\u5230\u5165\u7FA4\u7533\u8BF7$\n\n\u7533\u8BF7\u4EBA\uFF1A" + userId + "\n\n\u76EE\u6807\u7FA4\uFF1A" + targetGroup.groupId + "\n" + targetGroup.groupName + "\n\n" + seperate + "\n" + (_answer === '' ? '$用户未提供答案，使用QQ号查询分数$\n' : '') + pointsMessage + "\n" + seperate + "\n\n\u56DE\u590D\u6B64\u6D88\u606F\u4EE5\u5904\u7406\u5165\u7FA4\u7533\u8BF7\n\uFF08y/n/n [reason...]/i=\u5FFD\u7565\uFF09")];
                case 3:
                    newReplyMessageId = _a.sent();
                    if (pointsMessage.endsWith(config_1.default.pointsData404ErrorMsg) ||
                        pointsMessage.endsWith(config_1.default.pointsData404ErrorMsgBackup)) {
                        find(bot.createSession({
                            type: 'send',
                            subtype: 'group',
                            platform: 'onebot',
                            selfId: config_1.default.developer.onebot,
                            groupId: config_1.default.motGroup,
                            channelId: config_1.default.motGroup,
                        }), answer, logger);
                    }
                    return [2, newReplyMessageId];
            }
        });
    });
}
exports.sendGMRReminder = sendGMRReminder;

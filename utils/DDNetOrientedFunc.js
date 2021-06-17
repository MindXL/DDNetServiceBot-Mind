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
exports.sendGMRReminder = exports.sendMotQueued = exports.getPoints = void 0;
var axios_1 = __importDefault(require("axios"));
var lodash_1 = __importDefault(require("lodash"));
var config_1 = __importDefault(require("./config"));
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
                    _e.trys.push([1, 3, , 4]);
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
                        result += 'Player Not Found';
                    }
                    result += 'n';
                    return [3, 4];
                case 3:
                    e_1 = _e.sent();
                    if (e_1.response.status === 404) {
                        result += (_d = (_c = (_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) !== null && _d !== void 0 ? _d : '$出现未知错误$';
                        result += 'e';
                    }
                    else {
                        logger === null || logger === void 0 ? void 0 : logger.extend('getPoints').error(e_1);
                        result = '?';
                    }
                    return [3, 4];
                case 4: return [2, result];
            }
        });
    });
}
exports.getPoints = getPoints;
function sendMotQueued(content) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2];
    }); });
}
exports.sendMotQueued = sendMotQueued;
function sendGMRReminder(bot, userId, groupId, _answer, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var targetGroup, seperate, answer, pointsMessage, newReplyMessageId, flag;
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
                    return [4, bot.sendGroupMessage(config_1.default.motGroup, "$\u6536\u5230\u5165\u7FA4\u7533\u8BF7$\n\n\u7533\u8BF7\u4EBA\uFF1A" + userId + "\n\n\u76EE\u6807\u7FA4\uFF1A" + targetGroup.groupId + "\n" + targetGroup.groupName + "\n\n" + seperate + "\n" + (_answer === '' ? '$用户未提供答案，使用QQ号查询分数$\n' : '') + pointsMessage.slice(0, -1) + "\n" + seperate + "\n\n\u56DE\u590D\u6B64\u6D88\u606F\u4EE5\u5904\u7406\u5165\u7FA4\u7533\u8BF7\n\uFF08y/n/n [reason...]/i=\u5FFD\u7565\uFF09")];
                case 3:
                    newReplyMessageId = _a.sent();
                    flag = pointsMessage.slice(-1);
                    if (flag === 'e') {
                        bot.createSession({
                            type: 'send',
                            subtype: 'group',
                            platform: 'onebot',
                            selfId: config_1.default.developer.onebot,
                            groupId: config_1.default.motGroup,
                            channelId: config_1.default.motGroup,
                        }).execute("find " + answer);
                    }
                    return [2, newReplyMessageId];
            }
        });
    });
}
exports.sendGMRReminder = sendGMRReminder;

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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberRequest = void 0;
require("mysql");
var koishi_core_1 = require("koishi-core");
var GroupMemberRequest;
(function (GroupMemberRequest) {
    GroupMemberRequest.table = 'gmr';
    GroupMemberRequest.queryFields = [];
    var getters = [];
    function extend(getterDefault, getterQuery) {
        getters.push(getterDefault);
        GroupMemberRequest.queryFields.push.apply(GroupMemberRequest.queryFields, Object.keys(getterQuery));
    }
    GroupMemberRequest.extend = extend;
    var defaultSet = {
        groupId: undefined,
        selfId: undefined,
        time: undefined,
        userId: undefined,
        type: 'group-member-request',
        subtype: undefined,
        channelId: undefined,
        content: undefined,
        messageId: undefined,
        replyMessageId: undefined,
    };
    var querySet = {
        groupId: undefined,
        selfId: undefined,
        time: undefined,
        userId: undefined,
        channelId: undefined,
        content: undefined,
        messageId: undefined,
        replyMessageId: undefined,
    };
    extend(defaultSet, querySet);
    GroupMemberRequest.excludeKeys = ['type', 'subtype'];
    function create() {
        for (var _i = 0, getters_1 = getters; _i < getters_1.length; _i++) {
            var getter = getters_1[_i];
            Object.assign(defaultSet, getter);
        }
        return defaultSet;
    }
    GroupMemberRequest.create = create;
})(GroupMemberRequest = exports.GroupMemberRequest || (exports.GroupMemberRequest = {}));
koishi_core_1.Database.extend('koishi-plugin-mysql', {
    getConditions: function (type, set) {
        var _this = this;
        var empty = 'time = 0';
        if (!set)
            return empty;
        var keys;
        var pkeys = ['replyMessageId'];
        var ukeys = ['messageId'];
        var uukeys = ['groupId', 'userId', 'channelId'];
        if (type === 'replyMessageId') {
            keys = koishi_core_1.intersection(Object.keys(set), pkeys);
            if (keys.length !== 1)
                return empty;
        }
        else if (type === 'messageId') {
            keys = koishi_core_1.intersection(Object.keys(set), ukeys);
            if (keys.length !== 1)
                return empty;
        }
        else {
            keys = koishi_core_1.intersection(Object.keys(set), uukeys);
            if (keys.length !== 3)
                return empty;
        }
        var conditions = keys
            .map(function (key) {
            return _this.escapeId(key) + " = " + _this.escape(set[key], GroupMemberRequest.table, key);
        })
            .join(' AND ');
        return conditions;
    },
    getGMR: function (type, set) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.query("SELECT * FROM ?? WHERE " + this.getConditions(type, set), [GroupMemberRequest.table])];
                    case 1:
                        data = (_a.sent())[0];
                        return [2, data];
                }
            });
        });
    },
    getGMRs_N: function (end) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.query("SELECT * FROM " + GroupMemberRequest.table + " LIMIT " + end)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    deconGMRSession: function (session, replyMessageId) {
        var data = Object.assign(GroupMemberRequest.create(), session, {
            replyMessageId: replyMessageId,
            content: /答案：(.*?)$/.exec(session.content)[1],
        });
        return data;
    },
    createGMR: function (session, replyMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var gmr, keys, assignments;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gmr = this.deconGMRSession(session, replyMessageId);
                        keys = koishi_core_1.difference(Object.keys(gmr), GroupMemberRequest.excludeKeys);
                        assignments = keys
                            .map(function (key) {
                            key = _this.escapeId(key);
                            return key + " = VALUES(" + key + ")";
                        })
                            .join(', ');
                        return [4, this.query("INSERT INTO ?? (" + this.joinKeys(keys) + ") VALUES (" + keys
                                .map(function () { return '?'; })
                                .join(', ') + ")\n            ON DUPLICATE KEY UPDATE " + assignments, __spreadArray([
                                GroupMemberRequest.table
                            ], this.formatValues(GroupMemberRequest.table, gmr, keys)))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    removeGMR: function (type, set) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.query("DELETE FROM ?? WHERE " + this.getConditions(type, set), [GroupMemberRequest.table])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    setGMR: function (type, set, session, replyMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var gmr, keys, assignments;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gmr = this.deconGMRSession(session, replyMessageId);
                        keys = koishi_core_1.difference(Object.keys(gmr), GroupMemberRequest.excludeKeys);
                        assignments = keys
                            .map(function (key) {
                            return _this.escapeId(key) + " = " + _this.escape(gmr[key], GroupMemberRequest.table, key);
                        })
                            .join(', ');
                        return [4, this.query("UPDATE ?? SET " + assignments + " WHERE " + this.getConditions(type, set), [GroupMemberRequest.table])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    updateGMR: function (messageId, newReplyMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.query('UPDATE ?? SET `replyMessageId` = ? WHERE messageId = ?', [GroupMemberRequest.table, newReplyMessageId, messageId])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
});

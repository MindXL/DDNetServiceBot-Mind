"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Player = void 0;
var koishi_core_1 = require("koishi-core");
var Player;
(function (Player) {
    Player.table = 'user';
    Player.fields = [];
    var getters = [];
    function extend(getter) {
        getters.push(getter);
        Player.fields.push.apply(Player.fields, Object.keys(getter(null, '0')));
    }
    Player.extend = extend;
    extend(function () { return ({
        authority: 0,
        flag: 0,
        usage: {},
        timers: {},
    }); });
    function create(data) {
        var result = {};
        for (var _i = 0, getters_1 = getters; _i < getters_1.length; _i++) {
            var getter = getters_1[_i];
            Object.assign(result, getter(null, '0'), data);
        }
        return result;
    }
    Player.create = create;
})(Player = exports.Player || (exports.Player = {}));
koishi_core_1.Database.extend('koishi-plugin-mysql', {
    getPlayer: function (type, id, _fields) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, data;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fields = _fields
                            ? this.inferFields(Player.table, _fields)
                            : Player.fields;
                        if (fields && !fields.length)
                            return [2, (_a = {}, _a[type] = id, _a)];
                        if (!id)
                            return [2, undefined];
                        return [4, this.select(Player.table, fields, '?? = ?', [type, id])];
                    case 1:
                        data = (_c.sent())[0];
                        return [2, data && __assign(__assign({}, data), (_b = {}, _b[type] = id, _b))];
                }
            });
        });
    },
    getPlayers: function (type, ids, _fields) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, list;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                fields = _fields
                    ? this.inferFields(Player.table, _fields)
                    : Player.fields;
                if (fields && !fields.length)
                    return [2, (_a = {}, _a[type] = ids, _a)];
                if (!ids.length)
                    return [2, []];
                list = ids.map(function (id) { return _this.escape(id); }).join(',');
                return [2, this.select(Player.table, fields, "?? IN (" + list + ")", [
                        type,
                    ])];
            });
        });
    },
    removePlayer: function (type, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.query('DELETE FROM ?? WHERE ?? = ?', [
                            Player.table,
                            type,
                            id,
                        ])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    createPlayer: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var player, keys, assignments;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = Player.create(data);
                        keys = Object.keys(player);
                        assignments = keys
                            .map(function (key) {
                            key = _this.escapeId(key);
                            return key + " = VALUES(" + key + ")";
                        })
                            .join(', ');
                        return [4, this.query("INSERT INTO ?? (" + this.joinKeys(keys) + ") VALUES (" + keys
                                .map(function () { return '?'; })
                                .join(', ') + ")\n      ON DUPLICATE KEY UPDATE " + assignments, __spreadArray([Player.table], this.formatValues(Player.table, player, keys)))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    setPlayer: function (type, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, assignments;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data);
                        assignments = keys
                            .map(function (key) {
                            return _this.escapeId(key) + " = " + _this.escape(data[key], Player.table, key);
                        })
                            .join(', ');
                        return [4, this.query("UPDATE ?? SET " + assignments + " WHERE ?? = ?", [
                                Player.table,
                                type,
                                id,
                            ])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
});

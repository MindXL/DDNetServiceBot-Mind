"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sf = exports.ifInGroups = void 0;
var koishi_core_1 = require("koishi-core");
function ifInGroups(groupId, groupIds) {
    if (!groupIds.length)
        return false;
    var flag = false;
    for (var _i = 0, groupIds_1 = groupIds; _i < groupIds_1.length; _i++) {
        var check = groupIds_1[_i];
        if (groupId === check)
            flag = true;
    }
    return flag;
}
exports.ifInGroups = ifInGroups;
function sf(type, data) {
    return koishi_core_1.s.from(koishi_core_1.s(type, data));
}
exports.sf = sf;

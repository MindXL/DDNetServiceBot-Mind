"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteLenth = exports.sf = exports.getWatchCtx = exports.getMotCtx = exports.getModCtx = exports.getDevCtx = exports.autoAuthorize = exports.autoAssign = exports.ifInGroups = void 0;
var koishi_core_1 = require("koishi-core");
var config_1 = __importDefault(require("./config"));
function ifInGroups(groupId, groupIds) {
    if (!groupIds.length)
        return false;
    var flag = false;
    for (var _i = 0, groupIds_1 = groupIds; _i < groupIds_1.length; _i++) {
        var check = groupIds_1[_i];
        if (groupId === check) {
            flag = true;
            break;
        }
    }
    return flag;
}
exports.ifInGroups = ifInGroups;
function autoAssign(session) {
    return ifInGroups(session.groupId, __spreadArray([
        config_1.default.testGroup,
        config_1.default.motGroup
    ], config_1.default.watchGroups));
}
exports.autoAssign = autoAssign;
function autoAuthorize(session) {
    return ifInGroups(session.groupId, __spreadArray([
        config_1.default.testGroup,
        config_1.default.motGroup
    ], config_1.default.watchGroups))
        ? 1
        : 0;
}
exports.autoAuthorize = autoAuthorize;
function getDevCtx(ctx) {
    return ctx
        .group(config_1.default.testGroup)
        .union(ctx.unselect('groupId').user(config_1.default.mainQQ));
}
exports.getDevCtx = getDevCtx;
function getModCtx(ctx) {
    return ctx.group(config_1.default.modGroup).union(getDevCtx(ctx));
}
exports.getModCtx = getModCtx;
function getMotCtx(ctx) {
    return ctx.group(config_1.default.motGroup).union(getDevCtx(ctx));
}
exports.getMotCtx = getMotCtx;
function getWatchCtx(ctx) {
    return ctx.group.apply(ctx, config_1.default.watchGroups).union(getDevCtx(ctx));
}
exports.getWatchCtx = getWatchCtx;
function sf(type, data) {
    return koishi_core_1.s.from(koishi_core_1.s(type, data));
}
exports.sf = sf;
function byteLenth(str) {
    return Buffer.from(str, 'utf-8').length;
}
exports.byteLenth = byteLenth;

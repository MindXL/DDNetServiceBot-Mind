"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CustomFunc_1 = require("./CustomFunc");
var Config = {
    mysqlDB: '_koishi',
    selfId: '1066974992',
    modGroup: '834904988',
    motGroup: '834904988',
    mainQQ: '1634300602',
    bot2Id: '1718209151',
    testGroup: '834904988',
    developer: { onebot: '1634300602', name: 'Mind', authority: 4 },
    moderators: [
        { onebot: '616041132', name: 'Texas.C' },
        { onebot: '544844493', name: 'TsFreddie' },
        { onebot: '312253557', name: 'ACTom' },
        { onebot: '1085321861', name: 'Dan_cao' },
        { onebot: '745116989', name: 'Rice' },
        { onebot: '2754231645', name: 'xiaocan' },
        { onebot: '1242305018', name: 'ArchLinux' },
        { onebot: '2169140389', name: 'Dust dall' },
        { onebot: '994539654', name: 'KuNao' },
        { onebot: '1535650454', name: 'wuu' },
    ],
    watchGroups: ['1044036098', '869655189'],
    autoAssign: function (session) {
        return CustomFunc_1.ifInGroups(session.groupId, __spreadArray([
            Config.testGroup,
            Config.motGroup
        ], Config.watchGroups));
    },
    autoAuthorize: function (session) {
        return CustomFunc_1.ifInGroups(session.groupId, __spreadArray([
            Config.testGroup,
            Config.motGroup
        ], Config.watchGroups))
            ? 1
            : 0;
    },
    getTestCtx: function (ctx) {
        return ctx
            .group(Config.testGroup)
            .union(ctx.unselect('groupId').user(Config.mainQQ));
    },
    getModCtx: function (ctx) { return ctx.group(Config.modGroup); },
    getMotCtx: function (ctx) { return ctx.group(Config.motGroup); },
    getWatchCtx: function (ctx) {
        return ctx.group.apply(ctx, __spreadArray([Config.testGroup], Config.watchGroups));
    },
};
exports.default = Config;

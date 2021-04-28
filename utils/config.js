"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = {
    mysqlDB: 'koishi',
    selfId: '1718209151',
    mainQQ: '1634300602',
    bot2Id: '1718209151',
    testGroup: '834904988',
    modGroup: '1135333664',
    motGroup: '812953918',
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
    watchGroups: ['1044036098'],
    getTestCtx: function (ctx) {
        return ctx
            .group(Config.testGroup)
            .union(ctx.unselect('groupId').user(Config.mainQQ));
    },
    getModCtx: function (ctx) {
        return ctx.group(Config.modGroup).union(Config.getTestCtx(ctx));
    },
    getMotCtx: function (ctx) {
        return ctx.group(Config.motGroup).union(Config.getTestCtx(ctx));
    },
    getWatchCtx: function (ctx) {
        var _ctx = ctx.unselect('groupId');
        for (var _i = 0, _a = Config.watchGroups; _i < _a.length; _i++) {
            var groupId = _a[_i];
            _ctx = _ctx.group(groupId);
        }
        return _ctx.union(Config.getTestCtx(_ctx));
    },
};
exports.default = Config;
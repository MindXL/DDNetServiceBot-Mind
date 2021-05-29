import { Context, Session } from 'koishi-core';

import { ifInGroups } from './CustomFunc';

const Config = {
    // official
    mysqlDB: 'koishi',
    selfId: '1718209151',
    modGroup: '1135333664',
    motGroup: '1135333664',

    // only for develop
    // mysqlDB: '_koishi',
    // selfId: '1066974992',
    // modGroup: '834904988',
    // motGroup: '834904988',

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
        // { onebot: '1634300602', name: 'Mind' },
        { onebot: '1242305018', name: 'ArchLinux' },
        { onebot: '2169140389', name: 'Dust dall' },
        { onebot: '994539654', name: 'KuNao' },
        { onebot: '1535650454', name: 'wuu' },
    ],
    watchGroups: ['1044036098', '869655189'],

    autoAssign: (session: Session) =>
        ifInGroups(session.groupId!, [
            Config.testGroup,
            Config.motGroup,
            ...Config.watchGroups,
        ]),
    autoAuthorize: (session: Session) =>
        ifInGroups(session.groupId!, [
            Config.testGroup,
            Config.motGroup,
            ...Config.watchGroups,
        ])
            ? 1
            : 0,

    getTestCtx: (ctx: Context) =>
        ctx
            .group(Config.testGroup)
            .union(ctx.unselect('groupId').user(Config.mainQQ)),

    getModCtx: (ctx: Context) => ctx.group(Config.modGroup),
    getMotCtx: (ctx: Context) => ctx.group(Config.motGroup),
    getWatchCtx: (ctx: Context) =>
        ctx.group(...[Config.testGroup, ...Config.watchGroups]),
};
export default Config;

// declare module Config  {
//     export const mainQQ: '1634300602'
//     export const testGroup: '834904988'
// }

import { Context, Session } from 'koishi';

import Config from './config';

export function ifInGroups(groupId: string, groupIds: string[]): boolean {
    if (!groupIds.length) return false;
    let flag = false;
    for (const check of groupIds) {
        if (groupId === check) {
            flag = true;
            break;
        }
    }
    return flag;
}

export function autoAssign(session: Session): boolean {
    return ifInGroups(session.groupId!, [
        Config.testGroup,
        Config.motGroup,
        ...Config.watchGroups,
    ]);
}

export function autoAuthorize(session: Session): number {
    return ifInGroups(session.groupId!, [
        Config.testGroup,
        Config.motGroup,
        ...Config.watchGroups,
    ])
        ? 1
        : 0;
}

export function getDevCtx(ctx: Context): Context {
    return ctx
        .group(Config.testGroup)
        .union(ctx.unselect('groupId').user(Config.mainQQ));
}

export function getModCtx(ctx: Context): Context {
    return ctx.group(Config.modGroup).union(getDevCtx(ctx));
}

export function getMotCtx(ctx: Context): Context {
    return ctx.group(Config.motGroup).union(getDevCtx(ctx));
}

export function getWatchCtx(ctx: Context): Context {
    return ctx.group(...Config.watchGroups).union(getDevCtx(ctx));
}

// export function sf(type: string, data: s.Data): s.Parsed {
//     return s.from(s(type, data));
// }

export function byteLenth(str: string): number {
    return Buffer.from(str, 'utf-8').length;
}

import { s } from 'koishi-core';

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

export function sf(type: string, data: s.Data): s.Parsed {
    return s.from(s(type, data));
}

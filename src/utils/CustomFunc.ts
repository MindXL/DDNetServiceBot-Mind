import { Context, Session } from 'koishi-core';

import Config from './config';

const { Onebot, Discord } = Config;

export function autoAssign(session: Session): boolean {
    return (
        [Onebot.motGroup, ...Onebot.watchGroups]
            .concat([Discord.groupId])
            .includes(session.groupId!) ||
        [...Discord.watchChannels].includes(session.channelId!)
    );
}

export function autoAuthorize(session: Session): number {
    return autoAssign(session) ? 1 : 0;
}

export function getDevCtx(ctx: Context): Context {
    return ctx
        .group(Onebot.devGroup)
        .union(ctx.channel(Discord.devChannel))
        .union(
            ctx
                .select('platform', 'onebot')
                .unselect('groupId')
                .user(Onebot.developer.onebot)
        )
        .union(
            ctx
                .select('platform', 'discord')
                .unselect('groupId')
                .user(Discord.developer.discord)
        );
}

export function getModCtx(ctx: Context): Context {
    return ctx.group(Onebot.modGroup).union(ctx.channel(Discord.modChannel));
}

export function getMotCtx(ctx: Context): Context {
    return ctx.group(Onebot.motGroup).union(ctx.channel(Discord.motChannel));
}

export function getWatchCtx(ctx: Context): Context {
    return ctx
        .group(...Onebot.watchGroups)
        .union(ctx.channel(...Discord.watchChannels));
}

export function byteLenth(str: string): number {
    return Buffer.from(str, 'utf-8').length;
}

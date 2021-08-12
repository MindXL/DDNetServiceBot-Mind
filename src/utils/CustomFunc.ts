import { Context, Session } from 'koishi';

import Config from './config';

const { Onebot, Discord } = Config;

export function autoAssign(session: Session): boolean {
    return (
        [Onebot.motGroup, ...Onebot.watchGroups]
            .concat([Discord.groupId])
            .indexOf(session.groupId!) !== -1 ||
        [...Discord.watchChannels].indexOf(session.channelId!) !== -1
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
    return ctx
        .group(Onebot.modGroup)
        .union(ctx.channel(Discord.modChannel))
        .union(getDevCtx(ctx));
}

export function getMotCtx(ctx: Context): Context {
    return ctx
        .group(Onebot.motGroup)
        .union(ctx.channel(Discord.motChannel))
        .union(getDevCtx(ctx));
}

export function getWatchCtx(ctx: Context): Context {
    return ctx
        .group(...Onebot.watchGroups)
        .union(ctx.channel(...Discord.watchChannels))
        .union(getDevCtx(ctx));
}

export function byteLenth(str: string): number {
    return Buffer.from(str, 'utf-8').length;
}

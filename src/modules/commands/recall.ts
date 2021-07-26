import { Context, sleep } from 'koishi';
import { RecallConfig } from 'koishi-plugin-common';

export function recall(ctx: Context, { recallCount = 10 }: RecallConfig) {
    ctx = ctx.group();
    const recent: Record<string, string[]> = {};

    ctx.on('send', session => {
        const list = (recent[session.channelId!] ||= []);
        list.unshift(session.messageId!);
        if (list.length > recallCount) {
            list.pop();
        }
    });

    ctx.command('recall [count:number]', '撤回 bot 发送的消息', {
        authority: 3,
    }).action(async ({ session }, count = 1) => {
        const channelId = session?.channelId!;

        const list = recent[channelId];
        if (!list) return '近期没有发送消息。';

        const removal = list.splice(0, count);
        const delay = ctx.app?.options.delay?.broadcast;

        if (!list.length) delete recent[channelId];

        for (let index = 0; index < removal.length; index++) {
            if (index && delay) await sleep(delay);
            try {
                await session?.bot.deleteMessage(channelId, removal[index]);
            } catch (error) {
                ctx.logger('Command').extend('recall').warn(error);
            }
        }
    });
}

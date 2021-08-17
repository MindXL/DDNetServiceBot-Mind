import { Context } from 'koishi-core';
import { Logger } from 'koishi-utils';
import Config from '../../utils';

export function test(ctx: Context, logger: Logger) {
    ctx.on('connect', async () => {
        // await test1(ctx);
        await test2(ctx);
    });

    ctx.middleware(async (session, next) => {
        if (session.content === 'et') {
            console.log(1);
            // console.dir(await ctx.database.getGMR())
            await ctx.database.removeGMR('union', {
                userId: '1718209150',
                groupId: '834904988',
                channelId: '834904988',
            });
        }
        return next();
    });
}

async function test2(ctx: Context) {}

async function test1(ctx: Context) {
    const messageId = 'me';
    const replyMessageId = 're';
    const userId = 'us';
    const groupId = 'gr';
    const channelId = 'ch';

    console.dir(await ctx.database.getGMR('messageId', { messageId }));
    console.dir(await ctx.database.getGMR('messageId', { messageId }, []));
    console.dir(
        await ctx.database.getGMR('messageId', { messageId }, ['groupId'])
    );

    console.dir(
        await ctx.database.getGMR('replyMessageId', { replyMessageId })
    );
    console.dir(
        await ctx.database.getGMR('replyMessageId', { replyMessageId }, [])
    );
    console.dir(
        await ctx.database.getGMR('replyMessageId', { replyMessageId }, [
            'replyMessageId',
        ])
    );

    console.dir(
        await ctx.database.getGMR('union', { userId, groupId, channelId })
    );
    console.dir(
        await ctx.database.getGMR('union', { userId, groupId, channelId }, [])
    );
    console.dir(
        await ctx.database.getGMR('union', { userId, groupId, channelId }, [
            'messageId',
            'answer',
        ])
    );

    console.dir(await ctx.database.getGMR('messageId', { messageId: '1' }));
    console.dir(await ctx.database.getUser('onebot', '1'));
}

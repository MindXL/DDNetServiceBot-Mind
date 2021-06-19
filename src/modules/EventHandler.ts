import { Context, Time, sleep } from 'koishi';

import Config from '../utils/config';
import { getDevCtx, getWatchCtx } from '../utils/CustomFunc';
import { sendGMRReminder } from '../utils/DDNetOrientedFunc';
import '../utils/MysqlExtends/GroupMemberRequest';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const devCtx = getDevCtx(ctx);
    const watchCtx = getWatchCtx(ctx);

    const logger = ctx.logger('EventHandler');

    ctx.once('before-connect', async () => {
        (await ctx.database.getModerator('onebot', Config.developer.onebot)) ||
            (await ctx.database.createUser(
                'onebot',
                Config.developer.onebot,
                Config.developer
            ));

        for (const moderator of Config.moderators) {
            (await ctx.database.getModerator('onebot', moderator.onebot)) ||
                (await ctx.database.createModerator(moderator));
        }
    });

    ctx.before('command', ({ session, command }) => {
        try {
            const author = session?.author;

            if (session?.subtype === 'group') {
                console.log(
                    '{%s} [%s] `%s` %s calls command `%s`',
                    session?.channelId,
                    author?.userId,
                    author?.username,
                    author?.nickname ? '(`' + author?.nickname + '`) ' : '',
                    command?.name
                );
            } else if (session?.subtype === 'private') {
                console.log(
                    '{private} [%s] `%s` %s calls command `%s`',
                    author?.userId,
                    author?.username,
                    author?.nickname ? '(`' + author?.nickname + '`) ' : '',
                    command?.name
                );
            }
        } catch (e) {
            logger.extend('before-command').error(e);
        }
    });

    // devCtx.on('message', async (session) => {
    //     const groupId = session.groupId!;

    //     if (session.content === 'edelete') {
    //         let mId = await session.bot.sendMessage(groupId, 'pre');
    //         await sleep(3 * Time.second);
    //         session.bot.deleteMessage(groupId, mId);
    //     }
    // });

    // devCtx.on('message-deleted', (session) => {
    //     session.operatorId === session.selfId
    //         ? session.send('bot deleted a message\n\nsended by EventHandler')
    //         : session.send(
    //               'person deleted a message\n\nsended by EventHandler'
    //           );
    // });

    watchCtx.on('group-member-request', async (session) => {
        const answer = /答案：(.*?)$/.exec(session.content!)![1];

        const groupId = session.groupId!;
        const userId = session.userId!;

        const replyMessageId = await sendGMRReminder(
            session.bot,
            userId,
            groupId,
            answer,
            ctx.logger('points')
        );

        if (replyMessageId) {
            const set = {
                userId: session.userId!,
                groupId: session.groupId!,
                channelId: session.channelId!,
            };
            if (await ctx.database.getGMR('union', set))
                await ctx.database.setGMR(
                    'union',
                    set,
                    session,
                    replyMessageId
                );
            else await ctx.database.createGMR(session, replyMessageId);
        } else {
            session.bot.sendGroupMessage(
                Config.motGroup,
                '$Event On GMR出现未知错误，请联系Mind处理$\n错误标号：points/getPoints'
            );
        }
    });

    watchCtx.on('group-member-deleted', async (session) => {
        const userId = session.userId!;
        // const groupId = session.groupId!;
        // const operatorId = session.operatorId!;

        await ctx.database.remove('user', { onebot: [userId] });
        // let message: string = `$退群通知$\n\n用户${userId}\n\n`;
        // if (session.subtype === 'active') {
        //     message += '退出';
        // } else if (session.subtype === 'passive') {
        //     // const operator = await session.bot.getGroupMember(groupId,operatorId)
        //     message += `被${
        //         (
        //             await ctx.database.getModerator('onebot', operatorId, [
        //                 'name',
        //             ])
        //         ).name ?? operatorId
        //     }\n\n移出`;
        // }
        // message += `了群${groupId}\n${
        //     (await session.bot.getGroup(groupId)).groupName
        // }`;

        // await session.bot.sendGroupMessage(Config.motGroup, message);
    });

    // 可通过koishi-plugin-common插件实现，详见koishi.config.ts
    ctx.on('friend-request', async (session) => {
        await session.bot.handleFriendRequest(session.messageId!, false);
    });

    devCtx.on('message', async (session) => {
        if (session.content === 'et') {
        }
    });
};

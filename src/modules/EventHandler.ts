import { Context } from 'koishi';

import Config from '../utils/config';
import { sendGMRReminder } from '../utils/DDNetOrientedFunc';
import '../utils/MysqlExtends/GroupMemberRequest';

module.exports.name = 'EventHandler';

module.exports.apply = (ctx: Context) => {
    const testCtx = Config.getTestCtx(ctx);
    const watchCtx = Config.getWatchCtx(ctx);

    ctx.once('before-connect', async () => {
        await ctx.database.createUser(
            'onebot',
            Config.developer.onebot,
            Config.developer
        );
        for (const data of Config.moderators) {
            await ctx.database.createModerator(data);
        }
    });

    ctx.before('command', ({ session, command }) => {
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
    });

    // ctx.on('message', async (session) => {
    //     const groupId = session.groupId as string;

    //     if (session.content === 'edelete') {
    //         let mId = await session.bot.sendMessage(groupId, 'pre');
    //         await sleep(3 * Time.second);
    //         session.bot.deleteMessage(groupId, mId);
    //     }
    // });

    // ctx.on('message-deleted', (session) => {
    //     session.operatorId === session.selfId
    //         ? session.send('bot deleted a message\n\nsended by EventHandler')
    //         : session.send(
    //               'person deleted a message\n\nsended by EventHandler'
    //           );
    // });

    watchCtx.on('group-member-request', async (session) => {
        const answer = /答案：(.*?)$/.exec(session.content as string)![1];

        const groupId = session.groupId as string;
        const userId = session.userId as string;

        const replyMessageId = await sendGMRReminder(
            session.bot,
            userId,
            groupId,
            answer
        );
        await ctx.database.createGMR(session, replyMessageId);
    });

    watchCtx.on('group-member-deleted', async (session) => {
        const userId = session.userId as string;
        const groupId = session.groupId as string;
        const operatorId = session.operatorId as string;

        await ctx.database.remove('user', { onebot: [userId] });
        let message: string = `$退群通知$\n\n用户${userId}\n\n`;
        if (session.subtype === 'active') {
            message += '退出';
        } else if (session.subtype === 'passive') {
            // const operator = await session.bot.getGroupMember(groupId,operatorId)
            message += `被${
                (
                    await ctx.database.getModerator('onebot', operatorId, [
                        'name',
                    ])
                ).name ?? operatorId
            }\n\n移出`;
        }
        message += `了群${groupId}\n${
            (await session.bot.getGroup(groupId)).groupName
        }`;

        await session.bot.sendGroupMessage(Config.motGroup, message);
    });

    ctx.on('friend-request', async (session) => {
        await session.bot.handleFriendRequest(
            session.messageId as string,
            false
        );
    });

    testCtx.on('message', async (session) => {
        if (session.content === 'et') {
            // session.send('EventTest');
        }
    });
};

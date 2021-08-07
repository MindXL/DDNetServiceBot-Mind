import { Context, Time, sleep, s } from 'koishi';

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

    watchCtx.on('group-member-request', async session => {
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

    watchCtx.on('group-member-deleted', async session => {
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
    ctx.on('friend-request', async session => {
        await session.bot.handleFriendRequest(session.messageId!, false);
    });

    devCtx.on('message', async session => {
        if (session.content === 'et') {
            // const data = { hello: 'world' };
            // const msg =
            //     '[CQ:json,data=' +
            //     encodeURIComponent(JSON.stringify(data)) +
            //     ']';
            // const msg =
            //     '[CQ:json,data={"app":"com.tencent.qqvip_game_video"&#44;"desc":""&#44;"view":"gameVideoSingle"&#44;"ver":"0.0.0.1"&#44;"prompt":"&#91;应用&#93;"&#44;"meta":{"gameVideoSingle":{"DATA10":""&#44;"DATA11":""&#44;"DATA12":""&#44;"DATA13":"0"&#44;"DATA14":"videotest1"&#44;"DATA7":"http://ptlogin2.qq.com/ho_cross_domain?tourl=%68%74%74%70%73://%67%78%68%2e%76%69%70%2e%71%71%2e%63%6f%6d/%78%79%64%61%74%61/%66%75%6e%63%61%6c%6c/%66%75%6e%43%61%6c%6c/%32%37%33%33/%6d%65%64%69%61%2e%6d%70%34"}}&#44;"config":{"forward":1&#44;"height":-3000&#44;"type":"normal"&#44;"width":-2200}}]';
            // http://qm.qq.com/cgi-bin/qm/qr?k=-CpIqYGwe1GtzWCYjOKPAOXD70vRYfvU&authKey=AKOoMqzYd2Sr8UMPxbeeTNkISbq49f8UV8u9GJVUjkz76ma5Ajdt4W5CcRzrg19W&noverify=0&group_code=782528745
            // const data = {
            //     app: 'com.tencent.gxhServiceIntelligentTip',
            //     desc: '',
            //     view: 'gxhServiceIntelligentTip',
            //     ver: '',
            //     prompt: 'QQ红包大吉大利',
            //     meta: {
            //         gxhServiceIntelligentTip: {
            //             action: `http://ptlogin2.qq.com/ho_cross_domain?tourl=http://h5.qianbao.qq.com/publicaccount?redirect=${
            //                 'https://qm.qq.com/cgi-bin/qm/qr?k=-CpIqYGwe1GtzWCYjOKPAOXD70vRYfvU&authKey=AKOoMqzYd2Sr8UMPxbeeTNkISbq49f8UV8u9GJVUjkz76ma5Ajdt4W5CcRzrg19W&noverify=0&group_code=834904988' ??
            //                 'https://jq.qq.com/?k=SXJsTxqy'
            //             }`,
            //             appid: 'gxhServiceIntelligentTip',
            //             bgImg: 'http://ptlogin2.qq.com/ho_cross_domain?tourl=https://gxh.vip.qq.com/qqshow/admindata/comdata/vipActTpl_mobile_hbjnjl/6b09dc78c7ee87819716410a78391afe.gif',
            //             reportParams: null,
            //         },
            //     },
            //     config: {
            //         autoSize: 0,
            //         forward: 1,
            //         height: 240,
            //         type: 'normal',
            //         width: 180,
            //     },
            // };
            // const msg = `[CQ:json,data=${encodeURIComponent(
            //     JSON.stringify(data)
            // )}]`;
            // console.log(msg);
            // session.bot.$sendGroupMsg(session.groupId!, msg);
        }
    });
};

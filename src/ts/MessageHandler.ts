import { Context, segment } from 'koishi';
import 'koishi-adapter-onebot';

import Config from './config';

module.exports.name = 'MessageHandler';

module.exports.apply = (_ctx: Context) => {
    const ctx = _ctx;

    // 回应"hh"消息
    ctx.middleware((session, next) => {
        if (session.content === 'hh') {
            session.send('surprise');
        }
        return next();
    });

    // 回应@消息
    ctx.middleware((session, next) => {
        // 仅当接收到的消息包含了对机器人的称呼时才继续处理（比如消息以 @机器人 开头）
        if (session.content === 'segment') {
            return session.send('是你在叫我吗？');
        } else {
            // 如果去掉这一行，那么不满足上述条件的消息就不会进入下一个中间件了
            return next();
        }
    });

    // // 同一消息连续发送3次则复读一次
    let times = 0; // 复读次数
    let message = 'm'; // 当前消息
    ctx.middleware((session, next) => {
        if (session.content === message) {
            times += 1;
            if (times === 3) return session.send(message);
        } else {
            times = 0;
            message = session.content!;
            return next();
        }
    }, true /* true 表示这是前置中间件 */);

    ctx.middleware((session, next) => {
        if (session.content === 'hlep') {
            // 如果该 session 没有被截获，则这里的回调函数将会被执行
            return next(() => session.send('你想说的是 help 吗？'));
        } else {
            return next();
        }
    });

    ctx.middleware(async (session, next) => {
        if (session.parsed?.appel) {
            // @某某用户 我在叫你哟！
            await session.sendQueued(
                segment('at', { id: Config.mainQQ }) + '我在叫你哟！'
            );

            // 你发送了一张 Koishi 图标
            await session.sendQueued(
                segment('image', { url: 'https://koishi.js.org/koishi.png' })
            );

            await session.sendQueued(
                segment('anonymous') + '这是一条匿名消息。'
            );

            await session.sendQueued(
                segment('quote', { id: Config.mainQQ }) + '这是一条回复消息。'
            );

            await session.cancelQueued();
            // 执行后续操作
        }
        return next();
    });

    ctx.middleware(async (session, next) => {
        if (session.content === 'login') {
            await session.send('请输入用户名：');

            const name = await session.prompt();
            if (!name) return session.send('输入超时。');

            // 执行后续操作
            return session.send(`${name}，请多指教！`);
        }
        return next();
    });
};

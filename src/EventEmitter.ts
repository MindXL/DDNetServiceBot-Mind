import { Context, Command } from 'koishi';

module.exports.name = 'EventEmitter';

module.exports.apply = (_ctx: Context) => {
    const ctx = _ctx;

    Command.userFields(() => ['name']);

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
};

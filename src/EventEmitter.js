"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var koishi_1 = require("koishi");
module.exports.name = 'EventEmitter';
module.exports.apply = function (_ctx) {
    var ctx = _ctx;
    koishi_1.Command.userFields(function () { return ['name']; });
    ctx.before('command', function (_a) {
        var session = _a.session, command = _a.command;
        var author = session === null || session === void 0 ? void 0 : session.author;
        if ((session === null || session === void 0 ? void 0 : session.subtype) === 'group') {
            console.log('{%s} [%s] `%s` %s calls command `%s`', session === null || session === void 0 ? void 0 : session.channelId, author === null || author === void 0 ? void 0 : author.userId, author === null || author === void 0 ? void 0 : author.username, (author === null || author === void 0 ? void 0 : author.nickname) ? '(`' + (author === null || author === void 0 ? void 0 : author.nickname) + '`) ' : '', command === null || command === void 0 ? void 0 : command.name);
        }
        else if ((session === null || session === void 0 ? void 0 : session.subtype) === 'private') {
            console.log('{private} [%s] `%s` %s calls command `%s`', author === null || author === void 0 ? void 0 : author.userId, author === null || author === void 0 ? void 0 : author.username, (author === null || author === void 0 ? void 0 : author.nickname) ? '(`' + (author === null || author === void 0 ? void 0 : author.nickname) + '`) ' : '', command === null || command === void 0 ? void 0 : command.name);
        }
    });
};

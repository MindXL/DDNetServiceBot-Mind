import { GroupMemberRequest } from '../MysqlExtends';

// 缓存bot上线后出现的入群申请，若handleGMR.ts中收到的replyMessageId在缓存中就不必向数据库进行查找
// 也缓存执行gmr指令后从数据库中获取到的gmr
export const GMRCache: { [replyMessageId: string]: GroupMemberRequest } = {};

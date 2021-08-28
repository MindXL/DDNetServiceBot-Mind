// 缓存所有gmr的（包括数据库内和上线后出现的）replyMessageId
// 若第一次入群申请的提示消息未发出去，则对应的replyMessageId为undefined，这也是数组中会出现undefined的原因
export const GMRCache: (string | null)[] = [];

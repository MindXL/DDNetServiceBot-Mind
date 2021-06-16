// 你应该将 koishi-plugin-mysql 作为插件的 devDependency
// 这个空的导入在编译中会自然消失，但会提供必要的类型注入
import {} from 'koishi-plugin-mysql';
import 'mysql';
import {
    Database,
    Platform,
    TableType,
    difference,
    intersection,
} from 'koishi-core';

interface ReplyGroupMemberRequest {
    replyMessageId: string;
}

// 导出这张表的接口可以方便别人向这张表注入新的字段
export interface GroupMemberRequest
    extends Record<Platform, string>,
        ReplyGroupMemberRequest {
    groupId: string;
    selfId: string;
    time: number;
    userId: string;
    type: string;
    subtype: string;
    channelId: string;
    content: string;
    messageId: string;
}

export namespace GroupMemberRequest {
    export const table = 'gmr' as TableType;

    export type Field = keyof GroupMemberRequest;
    // 原生GMRSession
    // export type _Field = Exclude<Field, 'replyMessageId'>;
    // 数据库存储数据项
    export type QueryField = Exclude<Field, 'type' | 'subtype'>;
    // export const fields: Field[] = [];
    export const queryFields: QueryField[] = [];

    export type Index = 'messageId' | 'replyMessageId' | 'union';
    export type IndexSet =
        | Pick<GroupMemberRequest, 'replyMessageId'>
        | Pick<GroupMemberRequest, 'messageId'>
        | Pick<GroupMemberRequest, 'groupId' | 'userId' | 'channelId'>;

    type Getter = Partial<GroupMemberRequest>;
    const getters: Getter[] = [];
    export function extend(getterDefault: Getter, getterQuery: Getter) {
        getters.push(getterDefault);
        // fields.push(...(Object.keys(getterDefault) as any));
        queryFields.push(...(Object.keys(getterQuery) as any));
    }

    const defaultSet: Partial<GroupMemberRequest> = {
        groupId: undefined,
        selfId: undefined,
        time: undefined,
        userId: undefined,
        type: 'group-member-request',
        subtype: undefined,
        channelId: undefined,
        content: undefined,
        messageId: undefined,

        replyMessageId: undefined,
    };
    const querySet: Partial<GroupMemberRequest> = {
        groupId: undefined,
        selfId: undefined,
        time: undefined,
        userId: undefined,
        channelId: undefined,
        content: undefined,
        messageId: undefined,

        replyMessageId: undefined,
    };
    extend(defaultSet, querySet);

    export const excludeKeys = ['type', 'subtype'];

    export function create() {
        for (const getter of getters) {
            Object.assign(defaultSet, getter);
        }
        return defaultSet;
    }

    export type DataType4Create = Omit<GroupMemberRequest, 'type' | 'subtype'>;
}

declare module 'koishi-core' {
    interface Database {
        // 创建或修改时均传入session，在函数内进行数据项的裁剪

        getConditions<
            T extends GroupMemberRequest.Index,
            D extends GroupMemberRequest.IndexSet
        >(
            type: T,
            set: D
        ): string;
        // getGMR<T extends GroupMemberRequest.Index>(
        //     type: T,
        //     id: string
        // ): Promise<GroupMemberRequest>;
        getGMR<
            T extends GroupMemberRequest.Index,
            D extends GroupMemberRequest.IndexSet
        >(
            type: T,
            set: D
        ): Promise<GroupMemberRequest>;
        getGMRs_N(end: number): Promise<GroupMemberRequest[]>;
        // deconstruct GMRSession
        deconGMRSession(
            session: Session.Payload<'group-member-request', any>,
            replyMessageId: string
        ): Partial<GroupMemberRequest>;
        createGMR(
            session: Session.Payload<'group-member-request', any>,
            replyMessageId: string
        ): Promise<void>;
        removeGMR<
            T extends GroupMemberRequest.Index,
            D extends GroupMemberRequest.IndexSet
        >(
            type: T,
            set: D
        ): Promise<void>;
        // setGMR<T extends GroupMemberRequest.Index>(
        //     type: T,
        //     id: string,
        //     data: Partial<GroupMemberRequest>
        // ): Promise<void>;
        setGMR<
            T extends GroupMemberRequest.Index,
            D extends GroupMemberRequest.IndexSet
        >(
            type: T,
            set: D,
            session: Session.Payload<'group-member-request', any>,
            replyMessageId: string
        ): Promise<void>;
        // updateGMR<T extends GroupMemberRequest.PrimaryKey>(
        //     type: T,
        //     id: string,
        //     newReplyMessageId: string
        // ): Promise<void>;
        updateGMR(messageId: string, newReplyMessageId: string): Promise<void>;
    }
}

declare module 'koishi-plugin-mysql' {
    interface Tables {
        gmr: GroupMemberRequest;
    }
}

Database.extend('koishi-plugin-mysql', {
    getConditions(type, set) {
        const empty = 'time = 0';
        if (!set) return empty;

        let keys;
        const pkeys = ['replyMessageId'];
        const ukeys = ['messageId'];
        const uukeys = ['groupId', 'userId', 'channelId'];
        if (type === 'replyMessageId') {
            keys = intersection(Object.keys(set), pkeys);
            if (keys.length !== 1) return empty;
        } else if (type === 'messageId') {
            keys = intersection(Object.keys(set), ukeys);
            if (keys.length !== 1) return empty;
        } else {
            keys = intersection(Object.keys(set), uukeys);
            if (keys.length !== 3) return empty;
        }

        const conditions = keys
            .map((key) => {
                return `${this.escapeId(key)} = ${this.escape(
                    //@ts-ignore
                    set[key],
                    GroupMemberRequest.table,
                    key
                )}`;
            })
            .join(' AND ');

        return conditions;
    },
    // async getGMR(type, id) {
    //     if (!id) return undefined as any;
    //     const [data] = await this.select<GroupMemberRequest>(
    //         GroupMemberRequest.table,
    //         GroupMemberRequest.queryFields,
    //         '?? = ?',
    //         [type, id]
    //     );
    //     return data && { ...data, [type]: id };
    // },

    async getGMR(type, set) {
        const [data] = await this.query<GroupMemberRequest[]>(
            `SELECT * FROM ?? WHERE ${this.getConditions(type, set)}`,
            [GroupMemberRequest.table]
        );
        return data;
    },

    async getGMRs_N(end) {
        return await this.query<GroupMemberRequest[]>(
            `SELECT * FROM ${GroupMemberRequest.table} LIMIT ${end}`
        );
    },

    deconGMRSession(session, replyMessageId) {
        const data = Object.assign(GroupMemberRequest.create(), session, {
            replyMessageId: replyMessageId,
            content: /答案：(.*?)$/.exec(session.content!)![1],
        });
        return data;
    },

    async createGMR(session, replyMessageId) {
        // `gmr` equals `data`
        const gmr = this.deconGMRSession(session, replyMessageId);

        const keys = difference(
            Object.keys(gmr),
            GroupMemberRequest.excludeKeys
        );

        const assignments = keys
            .map((key) => {
                key = this.escapeId(key);
                return `${key} = VALUES(${key})`;
            })
            .join(', ');

        await this.query(
            `INSERT INTO ?? (${this.joinKeys(keys)}) VALUES (${keys
                .map(() => '?')
                .join(', ')})
            ON DUPLICATE KEY UPDATE ${assignments}`,
            [
                GroupMemberRequest.table,
                ...this.formatValues(GroupMemberRequest.table, gmr, keys),
            ]
        );
    },

    async removeGMR(type, set) {
        await this.query(
            `DELETE FROM ?? WHERE ${this.getConditions(type, set)}`,
            [GroupMemberRequest.table]
        );
    },

    // async setGMR(type, id, data) {
    //     const keys = Object.keys(data) as GroupMemberRequest.QueryField[];
    //     const assignments = keys
    //         .map((key) => {
    //             return `${this.escapeId(key)} = ${this.escape(
    //                 data[key],
    //                 GroupMemberRequest.table,
    //                 key
    //             )}`;
    //         })
    //         .join(', ');
    //     await this.query(`UPDATE ?? SET ${assignments} WHERE ?? = ?`, [
    //         GroupMemberRequest.table,
    //         type,
    //         id,
    //     ]);
    // },
    async setGMR(type, set, session, replyMessageId) {
        const gmr = this.deconGMRSession(session, replyMessageId);

        const keys = difference(
            Object.keys(gmr),
            GroupMemberRequest.excludeKeys
        ) as GroupMemberRequest.QueryField[];

        const assignments = keys
            .map((key) => {
                return `${this.escapeId(key)} = ${this.escape(
                    gmr[key],
                    GroupMemberRequest.table,
                    key
                )}`;
            })
            .join(', ');
        await this.query(
            `UPDATE ?? SET ${assignments} WHERE ${this.getConditions(
                type,
                set
            )}`,
            [GroupMemberRequest.table]
        );
    },

    // async updateGMR(type, id, newReplyMessageId) {
    //     await this.query('UPDATE ?? SET `replyMessageId` = ? WHERE ?? = ?', [
    //         GroupMemberRequest.table,
    //         newReplyMessageId,
    //         type,
    //         id,
    //     ]);
    // },
    async updateGMR(messageId, newReplyMessageId) {
        await this.query(
            'UPDATE ?? SET `replyMessageId` = ? WHERE messageId = ?',
            [GroupMemberRequest.table, newReplyMessageId, messageId]
        );
    },
});

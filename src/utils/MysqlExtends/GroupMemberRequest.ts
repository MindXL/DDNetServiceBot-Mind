// 你应该将 koishi-plugin-mysql 作为插件的 devDependency
// 这个空的导入在编译中会自然消失，但会提供必要的类型注入
import {} from 'koishi-plugin-mysql';
import 'mysql';
import { Database, Platform, TableType, difference } from 'koishi-core';

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
    export type _Field = Exclude<Field, 'replyMessageId'>;
    export type QueryField = Exclude<Field, 'type' | 'subtype'>;
    export const fields: Field[] = [];
    export const queryFields: QueryField[] = [];

    export type Index = Platform | 'userId' | 'messageId' | 'replyMessageId';

    type Getter = Partial<GroupMemberRequest>;
    const getters: Getter[] = [];
    export function extend(getterDefault: Getter, getterQuery: Getter) {
        getters.push(getterDefault);
        fields.push(...(Object.keys(getterDefault) as any));
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
}

declare module 'koishi-core' {
    interface Database {
        getGMR<T extends GroupMemberRequest.Index>(
            type: T,
            id: string
        ): Promise<GroupMemberRequest>;
        getGMRs_N(end: number): Promise<GroupMemberRequest[]>;
        createGMR(
            session: Session.Payload<'group-member-request', any>,
            replyMessageId: string
        ): Promise<void>;
        removeGMR<T extends GroupMemberRequest.Index>(
            type: T,
            id: string
        ): Promise<void>;
        // setGMR<T extends GroupMemberRequest.Index>(
        //     type: T,
        //     id: string,data:any): Promise<void>;
        updateGMR<T extends GroupMemberRequest.Index>(
            type: T,
            id: string,
            newReplyMessageId: string
        ): Promise<void>;
    }
}

declare module 'koishi-plugin-mysql' {
    interface Tables {
        gmr: GroupMemberRequest;
    }
}

Database.extend('koishi-plugin-mysql', {
    async getGMR(type, id) {
        if (!id) return undefined as any;
        const [data] = await this.select<GroupMemberRequest>(
            GroupMemberRequest.table,
            GroupMemberRequest.queryFields,
            '?? = ?',
            [type, id]
        );
        return data && { ...data, [type]: id };
    },

    async getGMRs_N(end) {
        return await this.query<GroupMemberRequest[]>(
            `SELECT * FROM ${GroupMemberRequest.table} LIMIT ${end}`
        );
    },

    async createGMR(session, replyMessageId) {
        session.content = /答案：(.*?)$/.exec(session.content as string)![1];

        const gmr = Object.assign(GroupMemberRequest.create(), session, {
            replyMessageId: replyMessageId,
        });

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

    async removeGMR(type, id) {
        await this.query('DELETE FROM ?? WHERE ?? = ?', [
            GroupMemberRequest.table,
            type,
            id,
        ]);
    },

    // async setGMR(type,id,data){
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
    // }
    async updateGMR(type, id, newReplyMessageId) {
        await this.query('UPDATE ?? SET `replyMessageId` = ? WHERE ?? = ?', [
            GroupMemberRequest.table,
            newReplyMessageId,
            type,
            id,
        ]);
    },
});

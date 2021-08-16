import { Database, Tables, Session, Query } from 'koishi-core';
// import * as utils from 'koishi-utils';
import _ from 'lodash';
import {} from 'koishi-plugin-mysql';

// 建表
Database.extend('koishi-plugin-mysql', ({ tables }) => {
    tables.gmr = {
        platform: 'VARCHAR(10) NOT NULL',
        userId: 'VARCHAR(20) NOT NULL',
        groupId: 'VARCHAR(25) NOT NULL',
        channelId: 'VARCHAR(25) NOT NULL',
        time: 'BIGINT UNSIGNED NOT NULL',
        answer: 'VARCHAR(50) NOT NULL',
        messageId: 'VARCHAR(25) NOT NULL',
        replyMessageId: 'VARCHAR(25) NOT NULL',
    };
});

export interface GroupMemberRequest {
    platform: string;
    userId: string;
    groupId: string;
    channelId: string;
    time: number;
    answer: string;
    messageId: string;
    replyMessageId: string;
}

declare module 'koishi-core' {
    interface Tables {
        gmr: GroupMemberRequest;
    }
}

Tables.extend('gmr', {
    primary: 'messageId',
    // 出错时replyMessageId的值均为-1，不能为unique
    unique: [['userId', 'groupId', 'channelId']],
    // fields: {
    //     platform: { type: 'string', length: 10 },
    //     userId: { type: 'string', length: 25, nullable: false },
    //     groupId: { type: 'string', length: 25, nullable: false },
    //     channelId: { type: 'string', length: 25 },
    //     time: { type: 'unsigned', nullable: false },
    //     answer: { type: 'string', length: 50, nullable: false },
    //     messageId: { type: 'string', length: 25, nullable: false },
    //     replyMessageId: { type: 'string', length: 25, nullable: false },
    // },
});

// 数据库支持
export namespace GroupMemberRequest {
    export const table = 'gmr';

    export type Field = keyof GroupMemberRequest;
    export type Index = 'messageId' | 'replyMessageId';
    export type UnionIndex = 'union';
    export type Union = 'userId' | 'groupId' | 'channelId';

    // export type Observed<K extends Field = Field> = utils.Observed<
    //     Pick<GroupMemberRequest, K>,
    //     Promise<void>
    // >;
    // type Getter = <T extends Index>(
    //     type: T,
    //     id: string
    // ) => Partial<GroupMemberRequest>;
    // const getters: Getter[] = [];

    // export function create<T extends Index>(
    //     type: T,
    //     id: string
    // ): GroupMemberRequest {
    //     const result = Tables.create('gmr');
    //     result[type] = id;
    //     for (const getter of getters) {
    //         Object.assign(result, getter(type, id));
    //     }
    //     return result;
    // }

    export const excludeKeys = ['selfId', 'type', 'subtype', 'content'];

    export interface Database {
        // parseGMRSession(
        //     session: Session.Payload<'group-member-request'>,
        //     replyMessageId: string,
        //     answer: string
        // ): GroupMemberRequest;
        // createGMR(
        //     session: Session.Payload<'group-member-request'>,
        //     replyMessageId: string,
        //     answer: string
        // ): Promise<void>;
        createGMR(gmr: GroupMemberRequest): Promise<void>;

        createFilter<
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>
        ): string;
        getGMR<
            K extends Field,
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>,
            modifier?: Query.Modifier<K>
        ): Promise<Pick<GroupMemberRequest, K | S>>;
        getGMRByNum<K extends Field>(
            end: number,
            modifier?: Query.Modifier<K>
        ): Promise<Pick<GroupMemberRequest, K>[]>;

        // setGMR<
        //     T extends Index | UnionIndex,
        //     S extends T extends Index ? T : Union
        // >(
        //     type: T,
        //     set: Pick<GroupMemberRequest, S>,
        //     replyMessageId: string
        // ): Promise<void>;
        updateGMR<
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>,
            replyMessageId: string
        ): Promise<void>;
        removeGMR<
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>
        ): Promise<void>;
    }
}

declare module 'koishi-core' {
    interface Database extends GroupMemberRequest.Database {}
}

Database.extend('koishi-plugin-mysql', {
    // parseGMRSession(session, replyMessageId, answer) {
    //     const gmr = {};

    //     _.map(session, (value, key) => {
    //         GroupMemberRequest.excludeKeys.indexOf(key) === -1 &&
    //             Object.assign(gmr, { [key]: value });
    //     });
    //     Object.assign(gmr, { replyMessageId, answer });
    //     return gmr as GroupMemberRequest;
    // },
    // async createGMR(session, replyMessageId, answer) {
    //     const gmr = parseGMRSession(session,  answer);
    //     const keys = Object.keys(gmr);
    //     const assignments = keys
    //         .map(key => {
    //             key = this.escapeId(key);
    //             return `${key} = VALUES(${key})`;
    //         })
    //         .join(', ');

    //     await this.query(
    //         `INSERT INTO ?? (${this.joinKeys(keys)}) VALUES (${keys
    //             .map(() => '?')
    //             .join(', ')}) ON DUPLICATE KEY UPDATE ${assignments}`,
    //         [
    //             GroupMemberRequest.table,
    //             ...this.formatValues(GroupMemberRequest.table, gmr, keys),
    //         ]
    //     );
    // },
    async createGMR(gmr) {
        const keys = Object.keys(gmr);
        const assignments = keys
            .map(key => {
                key = this.escapeId(key);
                return `${key} = VALUES(${key})`;
            })
            .join(', ');

        await this.query(
            `INSERT INTO ?? (${this.joinKeys(keys)}) VALUES (${keys
                .map(() => '?')
                .join(', ')}) ON DUPLICATE KEY UPDATE ${assignments}`,
            [
                GroupMemberRequest.table,
                ...this.formatValues(GroupMemberRequest.table, gmr, keys),
            ]
        );
    },

    createFilter(type, set) {
        const conditions: string[] = [];
        _.forEach(set, (value, key) =>
            conditions.push(`${this.escapeId(key)} = ${this.escape(value)}`)
        );

        return conditions.join(' AND ');
    },
    async getGMR(type, set, modifier) {
        const {
            fields = undefined,
            limit = undefined,
            offset = undefined,
        } = modifier ? Query.resolveModifier(modifier) : {};

        if (fields && !fields.length) {
            // modifier === []
            return set;
        }

        const filter = this.createFilter(type, set);
        const keys = fields
            ? this.joinKeys(this.inferFields(GroupMemberRequest.table, fields))
            : '*';

        let sql = `SELECT ${keys} FROM ${GroupMemberRequest.table} WHERE ${filter}`;
        if (limit) sql += ' LIMIT ' + limit;
        if (offset) sql += ' OFFSET ' + offset;
        const [data] = await this.query(sql);

        return data && Object.assign({ ...data }, set);
    },
    async getGMRByNum(end, modifier) {
        const { fields = undefined } = modifier
            ? Query.resolveModifier(modifier)
            : {};

        if (fields && !fields.length) {
            // modifier === []
            return [];
        }

        const keys = fields
            ? this.joinKeys(this.inferFields(GroupMemberRequest.table, fields))
            : '*';

        const [data] = await this.query(
            `SELECT ${keys} FROM ${GroupMemberRequest.table} LIMIT ${end}`
        );
        return [data && { ...data }];
    },

    // async setGMR(type, set, replyMessageId) {
    //     await this.query(
    //         `UPDATE ?? SET ?? = ? WHERE ${this.createFilter(type, set)}`,
    //         [GroupMemberRequest.table, 'replyMessageId', replyMessageId]
    //     );
    // },
    async updateGMR(type, set, replyMessageId) {
        await this.query(
            `UPDATE ?? SET ?? = ? WHERE ${this.createFilter(type, set)}`,
            [GroupMemberRequest.table, 'replyMessageId', replyMessageId]
        );
    },
    async removeGMR(type, set) {
        await this.query(
            `DELETE FROM ?? WHERE ${this.createFilter(type, set)}`,
            [GroupMemberRequest.table]
        );
    },
});

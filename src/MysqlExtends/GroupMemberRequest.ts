import { Database, Tables, Query } from 'koishi-core';
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
        content: 'VARCHAR(50) NOT NULL',
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
    content: string;
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
    unique: ['replyMessageId', ['userId', 'groupId', 'channelId']],
    // fields: {
    //     platform: { type: 'string', length: 10 },
    //     userId: { type: 'string', length: 25, nullable: false },
    //     groupId: { type: 'string', length: 25, nullable: false },
    //     channelId: { type: 'string', length: 25 },
    //     time: { type: 'unsigned', nullable: false },
    //     content: { type: 'string', length: 50, nullable: false },
    //     messageId: { type: 'string', length: 25, nullable: false },
    //     replyMessageId: { type: 'string', length: 25, nullable: false },
    // },
});

// 数据库支持
export namespace GroupMemberRequest {
    export const table = 'gmr';

    export type Field = keyof GroupMemberRequest;
    export const fields: Field[] = [];
    export type Index = 'messageId' | 'replyMessageId';
    export type UnionIndex = 'union';
    export type Union = 'userId' | 'groupId' | 'channelId';

    // export type Observed<K extends Field = Field> = utils.Observed<
    //     Pick<GroupMemberRequest, K>,
    //     Promise<void>
    // >;
    // type Getter = <T extends Index>(type: T, id: string) => Partial<GroupMemberRequest>
    // const getters: Getter[] = []

    export interface Database {
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
    }
}

declare module 'koishi-core' {
    interface Database extends GroupMemberRequest.Database {}
}

Database.extend('koishi-plugin-mysql', {
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
});

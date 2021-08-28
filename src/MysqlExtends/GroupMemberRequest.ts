import { Database, Tables, Query, Platform } from 'koishi-core';
import { difference } from 'koishi-utils';
import _ from 'lodash';
import {} from 'koishi-plugin-mysql';

export interface GroupMemberRequest {
    platform: Platform;
    userId: string;
    groupId: string;
    channelId: string;
    time: number;
    answer?: string;
    messageId: string;
    replyMessageId: string | null;
    extraMsgIds?: string[];
}

declare module 'koishi-core' {
    interface Tables {
        gmr: GroupMemberRequest;
    }
}

// 建表
Tables.extend('gmr', {
    primary: 'messageId',
    unique: [['userId', 'groupId', 'channelId'], 'replyMessageId'],
    fields: {
        platform: { type: 'string', length: 10, nullable: false },
        userId: { type: 'string', length: 25, nullable: false },
        groupId: { type: 'string', length: 25, nullable: false },
        channelId: { type: 'string', length: 25, nullable: false },
        time: { type: 'unsigned', nullable: false },
        answer: { type: 'string', length: 50 },
        messageId: { type: 'string', length: 25, nullable: false },
        replyMessageId: { type: 'string', length: 25 },
        extraMsgIds: { type: 'list' },
    },
});

// 数据库支持
export namespace GroupMemberRequest {
    export const table = 'gmr';

    export type Field = keyof GroupMemberRequest;
    export type Index = 'messageId' | 'replyMessageId';
    export type UnionIndex = 'union';
    export type Union = 'userId' | 'groupId' | 'channelId';

    export const excludeKeys = ['selfId', 'type', 'subtype', 'content'];

    export interface Database {
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
        // shouldn't be used anywhere
        setGMR<
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>,
            data: Partial<GroupMemberRequest>
        ): Promise<void>;
        updateGMR<
            T extends Index | UnionIndex,
            S extends T extends Index ? T : Union,
            D extends
                | Pick<GroupMemberRequest, 'replyMessageId'>
                | Partial<Pick<GroupMemberRequest, 'extraMsgIds'>>
        >(
            type: T,
            set: Pick<GroupMemberRequest, S>,
            data: D
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

        let sql = `SELECT ${keys} FROM ?? WHERE ${filter}`;
        if (limit) sql += ' LIMIT ' + limit;
        if (offset) sql += ' OFFSET ' + offset;
        const [data] = await this.query(sql, [GroupMemberRequest.table]);

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

        const data = await this.query(`SELECT ${keys} FROM ?? LIMIT ${end}`, [
            GroupMemberRequest.table,
        ]);
        return (data as GroupMemberRequest[]).map(gmr => ({ ...gmr }));
    },

    async setGMR(type, set, data) {
        Object.assign(data, set);
        const keys = Object.keys(data);
        const assignments = difference(keys, [type])
            .map(key => {
                return `${this.escapeId(key)} = ${this.escape(
                    data[key as keyof GroupMemberRequest],
                    GroupMemberRequest.table,
                    key
                )}`;
            })
            .join(', ');
        await this.query(
            `UPDATE ?? SET ${assignments} WHERE ${this.createFilter(
                type,
                set
            )}`,
            [GroupMemberRequest.table]
        );
    },
    async updateGMR(type, set, data) {
        await this.setGMR(type, set, data);
    },
    async removeGMR(type, set) {
        await this.query(
            `DELETE FROM ?? WHERE ${this.createFilter(type, set)}`,
            [GroupMemberRequest.table]
        );
    },
});

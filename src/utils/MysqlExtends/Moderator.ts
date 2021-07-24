import {} from 'koishi-plugin-mysql';
import { User, Database, TableType, Platform } from 'koishi-core';
import { difference } from 'koishi-utils';

export interface Moderator extends User {}

export namespace Moderator {
    export const table = 'user' as TableType;

    export type Field = keyof Moderator;
    export const fields: Field[] = [];
    export type Index = Platform | 'name' | 'id';

    type Getter = <T extends Index>(type: T, id: string) => Partial<Moderator>;
    const getters: Getter[] = [];

    export function extend(getter: Getter) {
        getters.push(getter);
        fields.push(...(Object.keys(getter(null as never, '0')) as any));
    }

    extend(() => ({
        authority: 0,
        flag: 0,
        usage: {},
        timers: {},
    }));

    export function create(data: Partial<Moderator>): Moderator {
        const result = {};
        for (const getter of getters) {
            Object.assign(result, getter(null as never, '0'), data);
        }
        return result as Moderator;
    }

    export type DataType4Create = Pick<Moderator, 'name' | 'onebot'> &
        Partial<Omit<Moderator, 'name' | 'onebot' | 'authority'>>;
    export const authority = 3;
}

declare module 'koishi-core' {
    interface Database {
        getModerator<K extends Moderator.Field, T extends Moderator.Index>(
            type: T,
            id: string,
            fields?: readonly K[]
        ): Promise<Pick<Moderator, K | T>>;
        getModerators<K extends Moderator.Field, T extends Moderator.Index>(
            type: T,
            ids: readonly string[],
            fields?: readonly K[]
        ): Promise<Pick<Moderator, K | T>[]>;
        createModerator<D extends Moderator.DataType4Create>(
            data: D
        ): Promise<void>;
        removeModerator<T extends Moderator.Index>(
            type: T,
            id: string
        ): Promise<void>;
        setModerator<
            T extends Moderator.Index,
            D extends Partial<Omit<Moderator, 'authority'>>
        >(
            type: T,
            id: string,
            data: D
        ): Promise<void>;
    }
}

Database.extend('koishi-plugin-mysql', {
    async getModerator(type, id, _fields) {
        const fields = _fields
            ? this.inferFields(Moderator.table, _fields)
            : Moderator.fields;
        if (fields && !fields.length) return { [type]: id } as any;
        if (!id) return undefined as any;
        const [data] = await this.select<Moderator>(
            Moderator.table,
            fields,
            '?? = ? AND `authority` >= ?',
            [type, id, Moderator.authority]
        );
        return data && { ...data, [type]: id };
    },

    async getModerators(type, ids, _fields) {
        const fields = _fields
            ? this.inferFields(Moderator.table, _fields)
            : Moderator.fields;
        if (fields && !fields.length) return { [type]: ids } as any;

        if (!ids.length) return [];
        const list = ids.map(id => this.escape(id)).join(',');
        return this.select<Moderator>(
            Moderator.table,
            fields,
            `?? IN (${list})  AND ?? >= ?`,
            [type, 'authority', Moderator.authority]
        );
    },

    async removeModerator(type, id) {
        await this.query('DELETE FROM ?? WHERE ?? = ? AND `authority` >= ?', [
            Moderator.table,
            type,
            id,
            Moderator.authority,
        ]);
    },

    async createModerator(data) {
        const mod = Object.assign(Moderator.create(data), { authority: 3 });
        const keys = Object.keys(mod);

        const assignments = keys
            .map(key => {
                key = this.escapeId(key);
                return `${key} = VALUES(${key})`;
            })
            .join(', ');

        await this.query(
            `INSERT INTO ?? (${this.joinKeys(keys)}) VALUES (${keys
                .map(() => '?')
                .join(', ')})
      ON DUPLICATE KEY UPDATE ${assignments}`,
            [Moderator.table, ...this.formatValues(Moderator.table, mod, keys)]
        );
    },

    async setModerator(type, id, data) {
        const keys = difference(Object.keys(data), ['authority']) as Exclude<
            Moderator.Field,
            'authority'
        >[];
        const assignments = keys
            .map(key => {
                return `${this.escapeId(key)} = ${this.escape(
                    data[key],
                    Moderator.table,
                    key
                )}`;
            })
            .join(', ');
        await this.query(`UPDATE ?? SET ${assignments} WHERE ?? = ?`, [
            Moderator.table,
            type,
            id,
        ]);
    },
});

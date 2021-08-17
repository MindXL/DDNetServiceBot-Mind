import { Database, Query, User, Platform } from 'koishi-core';
import _ from 'lodash';
import {} from 'koishi-plugin-mysql';

export interface Moderator extends User {}

export namespace Moderator {
    export const table = 'user';

    export type Field = keyof Moderator;
    export type Index = Platform | 'name' | 'id';

    export const authority = 3;

    export interface Database {
        createModerator<T extends Index>(
            type: T,
            id: string,
            data: Partial<User>
        ): Promise<void>;
        getModerator<K extends Field, T extends Index>(
            type: T,
            id: string,
            modifier?: Query.Modifier<K>
        ): Promise<Pick<Moderator, K | T>>;
        // getModerator<K extends Field, T extends Index>(type: T, ids: readonly string[], modifier?: Query.Modifier<K>): Promise<Pick<Moderator, K>[]>
        setModerator<T extends Index>(
            type: T,
            id: string,
            data: Pick<Moderator, 'name'>
        ): Promise<void>;
        removeModerator<T extends Index>(type: T, id: string): Promise<void>;
    }
}

declare module 'koishi-core' {
    interface Database extends Moderator.Database {}
}

Database.extend('koishi-plugin-mysql', {
    async createModerator(type, id, data) {
        await this.createUser(type, id, { ...data, authority: 3 });
    },
    async getModerator(type, id, modifier) {
        const [data] = await this.get(
            Moderator.table,
            {
                [type]: id,
                authority: { $gte: 3 },
            },
            modifier
        );
        return data && Object.assign({ ...data }, { [type]: id });
    },
    async setModerator(type, id, data) {
        await this.setUser(type, id, { ...data, authority: 3 });
    },
    async removeModerator(type, id) {
        this.remove(Moderator.table, {
            [type]: id,
            authority: { $gte: 3 },
        });
    },
});

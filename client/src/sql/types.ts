import type { SqlValue } from "sql.js";

export type SqlJsExecOutcome = {
    changes: number;
    last_insert_id: number;
};

export type SqlJsResultRow = Record<string, unknown>;

export type SqlJsMigrationRow = {
    id: number;
    name: string;
    applied_at: string;
};

export type SqlJsMigrationState = {
    applied_names: string[];
    applied_count: number;
};

export type SqlJsValue = SqlValue;

export type SqlJsParams = Readonly<Record<string, SqlJsValue>> | ReadonlyArray<SqlJsValue>;


export interface IClientSqlEncryptedStore {
    load(): Promise<Uint8Array | null>;
    save(bytes: Uint8Array): Promise<void>;
    remove(): Promise<void>;
}

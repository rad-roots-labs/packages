import type { IdbClientConfig, ResolveError } from "@radroots/utils";
import type { SqlValue } from "sql.js";
import type { BackupSqlPayload } from "../backup/types.js";

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

export type WebSqlEngineConfig = {
    store_key: string;
    idb_config: IdbClientConfig;
    cipher_config?: IdbClientConfig | null;
    sql_wasm_path?: string;
};

export interface IClientSqlEncryptedStore {
    load(): Promise<Uint8Array | null>;
    save(bytes: Uint8Array): Promise<void>;
    remove(): Promise<void>;
}

export interface IWebSqlEngine {
    close(): Promise<void>;
    purge_storage(): Promise<void>;
    exec(sql: string, params: SqlJsParams): SqlJsExecOutcome;
    query(sql: string, params: SqlJsParams): SqlJsResultRow[];
    export_bytes(): Uint8Array;
    import_bytes(bytes: Uint8Array): Promise<void>;
    export_backup(): Promise<ResolveError<BackupSqlPayload>>;
    import_backup(payload: BackupSqlPayload): Promise<ResolveError<void>>;
    get_store_id(): string;
}

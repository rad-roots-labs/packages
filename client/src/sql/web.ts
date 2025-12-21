import { handle_err, type IdbClientConfig, type ResolveError } from "@radroots/utils";
import { del as idb_del, get as idb_get, set as idb_set } from "idb-keyval";
import type { BindParams, Database, SqlJsStatic, SqlValue, Statement } from "sql.js";
import init_sql_js from "sql.js/dist/sql-wasm.js";
import { backup_b64_to_bytes, backup_bytes_to_b64 } from "../backup/codec.js";
import type { BackupSqlPayload } from "../backup/types.js";
import { WebCryptoService } from "../crypto/service.js";
import type { LegacyKeyConfig } from "../crypto/types.js";
import type { IClientSqlEncryptedStore, IWebSqlEngine, SqlJsExecOutcome, SqlJsParams, SqlJsResultRow } from "./types.js";

const DEFAULT_SQL_CIPHER_CONFIG: IdbClientConfig = {
    database: "radroots-web-sql-cipher",
    store: "default"
};

interface IWebSqlEngineEncryptedStore extends IClientSqlEncryptedStore {
    get_store_id(): string;
}

class WebSqlEngineEncryptedStore implements IWebSqlEngineEncryptedStore {
    private readonly db_key: string;
    private readonly store_id: string;
    private readonly crypto: WebCryptoService;

    constructor(key: string, cipher_config: IdbClientConfig | null) {
        this.db_key = key;
        this.store_id = `sql:${key}`;
        this.crypto = new WebCryptoService();
        const legacy_config: LegacyKeyConfig = {
            idb_config: cipher_config ?? DEFAULT_SQL_CIPHER_CONFIG,
            key_name: `radroots.sql.${key}.aes-gcm.key`,
            iv_length: 12,
            algorithm: "AES-GCM"
        };
        this.crypto.register_store_config({
            store_id: this.store_id,
            legacy_key: legacy_config,
            iv_length: 12
        });
    }

    public get_store_id(): string {
        return this.store_id;
    }

    private as_bytes(value: unknown): Uint8Array | null {
        if (value instanceof Uint8Array) return value;
        if (value instanceof ArrayBuffer) return new Uint8Array(value);
        if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        return null;
    }

    async load(): Promise<Uint8Array | null> {
        if (typeof indexedDB === "undefined") return null;
        const data = await idb_get(this.db_key);
        const bytes = this.as_bytes(data);
        if (!bytes) return null;
        const outcome = await this.crypto.decrypt_record(this.store_id, bytes);
        if (outcome.reencrypted) await idb_set(this.db_key, outcome.reencrypted);
        return outcome.plaintext;
    }

    async save(bytes: Uint8Array): Promise<void> {
        if (typeof indexedDB === "undefined") return;
        const enc = await this.crypto.encrypt(this.store_id, bytes);
        await idb_set(this.db_key, enc);
    }

    async remove(): Promise<void> {
        await idb_del(this.db_key);
    }
}

export class WebSqlEngine implements IWebSqlEngine {
    private save_timer: number | undefined;
    private db: Database;
    private readonly store_id: string;

    private constructor(
        private readonly sqljs: SqlJsStatic,
        db: Database,
        private readonly store: WebSqlEngineEncryptedStore
    ) {
        this.db = db;
        this.store_id = store.get_store_id();
    }

    static async create(store_key: string, cipher_config: IdbClientConfig | null): Promise<WebSqlEngine> {
        const sql = await init_sql_js({ locateFile: f => `/assets/${f}` });
        const kv = new WebSqlEngineEncryptedStore(store_key, cipher_config);
        const existing = await kv.load();
        const db = existing ? new sql.Database(existing) : new sql.Database();
        return new WebSqlEngine(sql, db, kv);
    }

    async close(): Promise<void> {
        this.db.close();
    }

    async purge_storage(): Promise<void> {
        await this.store.remove();
    }

    public get_store_id(): string {
        return this.store_id;
    }

    private schedule_persist(): void {
        if (this.save_timer) return;
        this.save_timer = self.setTimeout(async () => {
            const bytes = this.db.export();
            await this.store.save(bytes);
            this.save_timer = undefined;
        }, 200);
    }

    public exec(sql: string, params: SqlJsParams): SqlJsExecOutcome {
        const st = this.prepare(sql);
        this.bind(st, params);
        const result = this.consume_exec(st);
        st.free();
        this.schedule_persist();
        return result;
    }

    public query(sql: string, params: SqlJsParams): SqlJsResultRow[] {
        const st = this.prepare(sql);
        this.bind(st, params);
        const rows = this.collect_rows(st);
        st.free();
        return rows;
    }

    public export_bytes(): Uint8Array {
        return this.db.export();
    }

    public async import_bytes(bytes: Uint8Array): Promise<void> {
        this.db.close();
        this.db = new this.sqljs.Database(bytes);
        await this.store.save(bytes);
    }

    public async export_backup(): Promise<ResolveError<BackupSqlPayload>> {
        try {
            const bytes = this.export_bytes();
            return { bytes_b64: backup_bytes_to_b64(bytes) };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async import_backup(payload: BackupSqlPayload): Promise<ResolveError<void>> {
        try {
            const bytes = backup_b64_to_bytes(payload.bytes_b64);
            await this.import_bytes(bytes);
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    private prepare(sql: string): Statement {
        return this.db.prepare(sql);
    }

    private bind(st: Statement, params: SqlJsParams): void {
        let bind_params: BindParams;
        if (Array.isArray(params)) bind_params = [...params];
        else bind_params = { ...(params as Readonly<Record<string, SqlValue>>) };
        st.bind(bind_params);
    }

    private consume_exec(st: Statement): SqlJsExecOutcome {
        const changes_before = this.db.getRowsModified();
        let last_id = 0;

        while (st.step()) {
            const col_names = st.getColumnNames();
            const idx = col_names.indexOf("last_insert_rowid()");
            if (idx >= 0) {
                const v = st.get()[idx];
                if (typeof v === "number") last_id = v;
            }
        }

        const changes = this.db.getRowsModified() - changes_before;

        if (!last_id) {
            const res = this.db.exec("select last_insert_rowid() as id");
            if (res[0]?.values?.[0]?.[0]) {
                const v = res[0].values[0][0];
                if (typeof v === "number") {
                    last_id = v;
                }
            }
        }

        return { changes, last_insert_id: last_id };
    }

    private collect_rows(st: Statement): SqlJsResultRow[] {
        const out: SqlJsResultRow[] = [];
        const names = st.getColumnNames();

        while (st.step()) {
            const row = st.get();
            const obj: SqlJsResultRow = {};
            for (let i = 0; i < names.length; i++) obj[names[i]] = row[i];
            out.push(obj);
        }

        return out;
    }
}

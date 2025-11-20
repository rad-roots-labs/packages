import { IdbClientConfig } from "@radroots/utils";
import { del as idb_del } from "idb-keyval";
import type { BindParams, Database, SqlJsStatic, SqlValue, Statement } from "sql.js";
import init_sql_js from "sql.js/dist/sql-wasm.js";
import { WebAesGcmCipher } from "../cipher/web.js";
import type { IClientSqlEncryptedStore, SqlJsExecOutcome, SqlJsParams, SqlJsResultRow } from "./types.js";

class WebSqlEngineEncryptedStore implements IClientSqlEncryptedStore {
    private readonly db_key: string;
    private readonly cipher: WebAesGcmCipher;

    constructor(key: string, cipher?: WebAesGcmCipher) {
        this.db_key = key;
        this.cipher = cipher ?? new WebAesGcmCipher({
            idb_config: {
                database: "radroots-web-sql-cipher",
                store: "default"
            },
            key_name: `radroots.sql.${key}.aes-gcm.key`
        });
    }

    async load() {
        if (typeof indexedDB === "undefined") {
            return null;
        }
        const { get } = await import("idb-keyval");
        const data = await get(this.db_key);
        if (data instanceof Uint8Array) {
            return this.cipher.decrypt(data);
        }
        return null;
    }

    async save(bytes: Uint8Array) {
        if (typeof indexedDB === "undefined") {
            return;
        }
        const { set } = await import("idb-keyval");
        const enc = await this.cipher.encrypt(bytes);
        await set(this.db_key, enc);
    }

    async remove() {
        await idb_del(this.db_key);
    }
}

export class WebSqlEngine {
    private save_timer: number | undefined;

    private constructor(
        private readonly sqljs: SqlJsStatic,
        private readonly db: Database,
        private readonly store: WebSqlEngineEncryptedStore
    ) { }

    static async create(store_key: string, cipher_config: IdbClientConfig | null): Promise<WebSqlEngine> {
        const sql = await init_sql_js({ locateFile: f => `/assets/${f}` });

        const cipher = new WebAesGcmCipher({
            idb_config: cipher_config || {
                database: "radroots-web-sql-cipher",
                store: "default"
            },
            key_name: `radroots.sql.${store_key}.aes-gcm.key`
        });

        const kv = new WebSqlEngineEncryptedStore(store_key, cipher);

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

    private schedule_persist(): void {
        if (this.save_timer) {
            return;
        }
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

    private prepare(sql: string): Statement {
        return this.db.prepare(sql);
    }

    private bind(st: Statement, params: SqlJsParams): void {
        let bind_params: BindParams;
        if (Array.isArray(params)) {
            bind_params = [...params];
        } else {
            bind_params = { ...(params as Readonly<Record<string, SqlValue>>) };
        }
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
                if (typeof v === "number") {
                    last_id = v;
                }
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
            for (let i = 0; i < names.length; i++) {
                obj[names[i]] = row[i];
            }
            out.push(obj);
        }

        return out;
    }
}

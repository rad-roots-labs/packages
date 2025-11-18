import { del as idb_del } from "idb-keyval";
import type { BindParams, Database, SqlJsStatic, SqlValue, Statement } from "sql.js";
import init_sql_js from "sql.js/dist/sql-wasm.js";
import { AesGcmKeystoreCipher } from "../keystore/aes-gcm-cipher.js";
import type { IClientSqlEncryptedStore, SqlJsExecOutcome, SqlJsParams, SqlJsResultRow } from "./types.js";

class WebSqlEngineEncryptedStore implements IClientSqlEncryptedStore {
    constructor(private readonly key: string) { }

    async load() {
        const get = (globalThis as any).indexedDB ? (await import("idb-keyval")).get : null;
        if (!get) return null;
        const data = await get(this.key);
        if (data instanceof Uint8Array) return AesGcmKeystoreCipher.decrypt(data);
        return null;
    }

    async save(bytes: Uint8Array) {
        const enc = await AesGcmKeystoreCipher.encrypt(bytes);
        const set = (globalThis as any).indexedDB ? (await import("idb-keyval")).set : null;
        if (set) await set(this.key, enc);
    }

    async remove() {
        await idb_del(this.key);
    }
}

export class WebSqlEngine {
    private save_timer: number | undefined;

    private constructor(
        private readonly sqljs: SqlJsStatic,
        private readonly db: Database,
        private readonly store: WebSqlEngineEncryptedStore
    ) { }

    static async create(store_key: string): Promise<WebSqlEngine> {
        const sql = await init_sql_js({ locateFile: f => `/assets/${f}` });
        const kv = new WebSqlEngineEncryptedStore(store_key);
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

    private prepare(sql: string): Statement {
        return this.db.prepare(sql);
    }

    private bind(st: Statement, params: SqlJsParams): void {
        let bindParams: BindParams;
        if (Array.isArray(params)) {
            bindParams = [...params];
        } else {
            bindParams = { ...(params as Readonly<Record<string, SqlValue>>) };
        }
        st.bind(bindParams);
    }

    private consume_exec(st: Statement): SqlJsExecOutcome {
        const changes_before = this.db.getRowsModified();
        let last_id = 0;
        while (st.step()) {
            const colNames = st.getColumnNames();
            const idx = colNames.indexOf("last_insert_rowid()");
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


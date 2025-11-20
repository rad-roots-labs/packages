import type { SqlJsParams, SqlJsValue } from "../sql/types.js";
import { WebSqlEngine } from "../sql/web.js";

function parse_sql_params(params_json: string): SqlJsParams {
    const trimmed = params_json.trim();
    if (!trimmed) return [];
    try {
        const raw = JSON.parse(trimmed) as unknown;
        if (Array.isArray(raw)) return raw as ReadonlyArray<SqlJsValue>;
        if (raw && typeof raw === "object") return raw as Readonly<Record<string, SqlJsValue>>;
        return [];
    } catch {
        return [];
    }
}

export function radroots_sql_install_bridges(engine: WebSqlEngine): void {
    Object.assign(globalThis, {
        __radroots_sql_wasm_exec: (sql: string, params_json: string) => {
            const params = parse_sql_params(params_json);
            const res = engine.exec(sql, params);
            return res;
        },
        __radroots_sql_wasm_query: (sql: string, params_json: string) => {
            const params = parse_sql_params(params_json);
            const res = engine.query(sql, params);
            return res;
        }
    });
}
import type { SqlJsParams, SqlJsValue } from "../sql/types.js";
import { WebSqlEngine } from "../sql/web.js";

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_sql_value = (value: unknown): value is SqlJsValue => {
    if (value === null) return true;
    if (typeof value === "string") return true;
    if (typeof value === "number") return Number.isFinite(value);
    return value instanceof Uint8Array;
};

const is_sql_value_array = (value: unknown): value is ReadonlyArray<SqlJsValue> =>
    Array.isArray(value) && value.every(is_sql_value);

const is_sql_value_record = (value: unknown): value is Readonly<Record<string, SqlJsValue>> =>
    is_record(value) && Object.values(value).every(is_sql_value);

function parse_sql_params(params_json: string): SqlJsParams {
    const trimmed = params_json.trim();
    if (!trimmed) return [];
    try {
        const raw = JSON.parse(trimmed);
        if (is_sql_value_array(raw)) return raw;
        if (is_sql_value_record(raw)) return raw;
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

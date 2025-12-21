import { err_msg, handle_err, type IdbClientConfig, type ResolveError, type ResultObj, type ResultPass, type ResultsList } from "@radroots/utils";
import { createStore, clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import { cl_datastore_error } from "./error.js";
import type {
    IClientDatastore,
    IClientDatastoreDelPrefResolve,
    IClientDatastoreDelResolve,
    IClientDatastoreKeyMap,
    IClientDatastoreKeyParamMap
} from "./types.js";

const DEFAULT_IDB_CONFIG: IdbClientConfig = {
    database: "radroots-web-datastore",
    store: "default",
};

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export interface IWebDatastore<
    Tk extends IClientDatastoreKeyMap,
    Tp extends IClientDatastoreKeyParamMap,
    TkO extends IClientDatastoreKeyMap,
> extends IClientDatastore<Tk, Tp, TkO> { }

export class WebDatastore<
    Tk extends IClientDatastoreKeyMap,
    Tp extends IClientDatastoreKeyParamMap,
    TkO extends IClientDatastoreKeyMap,
> implements IWebDatastore<Tk, Tp, TkO> {
    private db_name: string;
    private store_name: string;
    private store: UseStore | null = null;
    private _key_map: Tk;
    private _key_param_map: Tp;
    private _key_obj_map: TkO;

    constructor(key_map: Tk, key_param_map: Tp, key_obj_map: TkO, config?: Partial<IdbClientConfig>) {
        this.db_name = config?.database ?? DEFAULT_IDB_CONFIG.database;
        this.store_name = config?.store ?? DEFAULT_IDB_CONFIG.store;
        this.store = null;
        this._key_map = key_map;
        this._key_param_map = key_param_map;
        this._key_obj_map = key_obj_map;
    }

    private get_store(): UseStore {
        if (!this.store) {
            if (typeof indexedDB === "undefined") throw new Error(cl_datastore_error.idb_undefined);
            this.store = createStore(this.db_name, this.store_name);
        }
        return this.store;
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.db_name,
            store: this.store_name,
        };
    }

    public async init(): Promise<ResolveError<void>> {
        try {
            this.get_store();
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set(key: keyof Tk, value: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            await idb_set(this._key_map[key], value, this.get_store());
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get(key: keyof Tk): Promise<ResolveError<ResultObj<string>>> {
        try {
            const value = await idb_get(this._key_map[key], this.get_store());
            if (!value) return err_msg(cl_datastore_error.no_result);
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del(key: keyof Tk): Promise<IClientDatastoreDelResolve> {
        try {
            await idb_del(this._key_map[key], this.get_store());
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set_obj<T extends TkO>(key: keyof TkO, value: T): Promise<ResolveError<ResultObj<TkO>>> {
        try {
            await idb_set(this._key_obj_map[key], JSON.stringify(value), this.get_store());
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async update_obj<T extends TkO>(key: keyof TkO, value: Partial<T>): Promise<ResolveError<ResultObj<TkO>>> {
        try {
            const k = this._key_obj_map[key];
            const obj_curr: Record<string, unknown> = {};
            const curr = await idb_get(k, this.get_store());
            if (curr) {
                const parsed: unknown = JSON.parse(curr);
                if (is_record(parsed)) for (const [curr_key, curr_val] of Object.entries(parsed)) if (curr_val) obj_curr[curr_key] = curr_val;
            }
            const obj: T = { ...obj_curr, ...value } as any;
            await idb_set(k, JSON.stringify(obj), this.get_store());
            return { result: obj };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get_obj<T>(key: keyof TkO): Promise<ResolveError<ResultObj<T>>> {
        try {
            const value = await idb_get(this._key_obj_map[key], this.get_store());
            if (!value) return err_msg(cl_datastore_error.no_result);
            return { result: JSON.parse(value) };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_obj(key: keyof TkO): Promise<ResolveError<ResultObj<string>>> {
        try {
            await idb_del(this._key_obj_map[key], this.get_store());
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async setp<K extends keyof Tp>(
        key: K,
        key_param: Parameters<Tp[K]>[0],
        value: string
    ): Promise<ResolveError<ResultObj<string>>> {
        try {
            await idb_set(this._key_param_map[key](key_param), value, this.get_store());
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async getp<K extends keyof Tp>(
        key: K,
        key_param: Parameters<Tp[K]>[0]
    ): Promise<ResolveError<ResultObj<string>>> {
        try {
            const value = await idb_get(this._key_param_map[key](key_param), this.get_store());
            if (!value) return err_msg(cl_datastore_error.no_result);
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve> {
        try {
            const all_keys = await idb_keys(this.get_store());
            const filtered_keys = all_keys.filter((k): k is string => (typeof k === "string" && k.startsWith(key_prefix)));
            for (const key of filtered_keys) {
                await idb_del(key, this.get_store());
            }
            return { results: filtered_keys };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<ResolveError<ResultsList<string>>> {
        try {
            const all_keys = await idb_keys(this.get_store());
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ResolveError<ResultPass>> {
        try {
            await idb_clear(this.get_store());
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

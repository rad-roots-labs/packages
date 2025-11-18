import { err_msg, handle_err, ResolveError, ResultObj } from "@radroots/utils";
import {
    createStore,
    clear as idb_clear,
    del as idb_del,
    get as idb_get,
    keys as idb_keys,
    set as idb_set,
    type UseStore
} from "idb-keyval";
import { type IClientIdbConfig } from "../utils/idb.js";
import type {
    IClientDatastore,
    IClientDatastoreDelPrefResolve,
    IClientDatastoreDelResolve,
    IClientDatastoreGetPResolve,
    IClientDatastoreGetResolve,
    IClientDatastoreKeyMap,
    IClientDatastoreKeyParamMap,
    IClientDatastoreKeysResolve,
    IClientDatastoreSetPResolve,
    IClientDatastoreSetResolve
} from "./types.js";

export class WebDatastore<
    Tk extends IClientDatastoreKeyMap,
    Tp extends IClientDatastoreKeyParamMap,
    TkO extends IClientDatastoreKeyMap,
> implements IClientDatastore<Tk, Tp, TkO> {
    private db_name: string;
    private store_name: string;
    private store: UseStore | null = null;
    private _key_map: Tk;
    private _key_param_map: Tp;
    private _key_obj_map: TkO;

    constructor(key_map: Tk, key_param_map: Tp, key_obj_map: TkO, config?: IClientIdbConfig) {
        this.db_name = config?.database || "radroots-web-datastore";
        this.store_name = config?.store || "default";
        this.store = null;
        this._key_map = key_map;
        this._key_param_map = key_param_map;
        this._key_obj_map = key_obj_map;
    }

    private get_store(): UseStore {
        if (!this.store) {
            if (typeof indexedDB === "undefined") throw new Error("error.client.keystore.idb_undefined");
            this.store = createStore(this.db_name, this.store_name);
        }
        return this.store;
    }

    public async init() {
        try {
            this.get_store();
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set(key: keyof Tk, value: string): Promise<IClientDatastoreSetResolve> {
        try {
            await idb_set(this._key_map[key], value, this.get_store());
            return { pass: true };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get(key: keyof Tk): Promise<IClientDatastoreGetResolve> {
        try {
            const value = await idb_get(this._key_map[key], this.get_store());
            if (!value) return err_msg("error.client.datastore.no_result")
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del(key: keyof Tk): Promise<IClientDatastoreDelResolve> {
        try {
            await idb_del(this._key_map[key]);
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set_obj<T>(key: keyof TkO, value: T): Promise<IClientDatastoreSetResolve> {
        try {
            await idb_set(this._key_obj_map[key], JSON.stringify(value), this.get_store());
            return { pass: true };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async update_obj<T>(key: keyof TkO, value: Partial<T>): Promise<IClientDatastoreSetResolve> {
        try {
            const k = this._key_obj_map[key];
            const curr = await idb_get(k, this.get_store());
            const obj_u: any = {}
            if (curr) for (const [curr_key, curr_val] of Object.entries(JSON.parse(curr))) if (curr_val) obj_u[curr_key] = curr_val;
            await idb_set(k, JSON.stringify({
                ...obj_u,
                ...value
            }), this.get_store());
            return { pass: true };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get_obj<T>(key: keyof TkO): Promise<ResolveError<ResultObj<T>>> {
        try {
            const value = await idb_get(this._key_obj_map[key], this.get_store());
            if (!value) return err_msg("error.client.datastore.no_result")
            return { result: JSON.parse(value) };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_obj(key: keyof TkO): Promise<IClientDatastoreDelResolve> {
        try {
            await idb_del(this._key_obj_map[key]);
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async setp<K extends keyof Tp>(
        key: K,
        key_param: Parameters<Tp[K]>[0],
        value: string
    ): Promise<IClientDatastoreSetPResolve> {
        try {
            await idb_set(this._key_param_map[key](key_param), value, this.get_store());
            return { pass: true };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async getp<K extends keyof Tp>(
        key: K,
        key_param: Parameters<Tp[K]>[0]
    ): Promise<IClientDatastoreGetPResolve> {
        try {
            const value = await idb_get(this._key_param_map[key](key_param));
            if (!value) return err_msg("error.client.datastore.no_result")
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve> {
        try {
            const all_keys = await idb_keys(this.get_store());
            console.log(JSON.stringify(all_keys, null, 4), `all_keys`)
            const filtered_keys = all_keys.filter((k): k is string => (typeof k === "string" && k.startsWith(key_prefix)));
            console.log(JSON.stringify(filtered_keys, null, 4), `filtered_keys`)
            for (const key of filtered_keys) {
                await idb_del(key);
            }
            return { results: filtered_keys };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<IClientDatastoreKeysResolve> {
        try {
            const all_keys = await idb_keys(this.get_store());
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset() {
        try {
            await idb_clear(this.get_store());
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}
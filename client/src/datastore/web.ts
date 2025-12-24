import { err_msg, handle_err, text_dec, text_enc, type IdbClientConfig, type ResolveError, type ResultObj, type ResultPass, type ResultsList } from "@radroots/utils";
import { createStore, clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import type { BackupDatastorePayload } from "../backup/types.js";
import { WebCryptoService } from "../crypto/service.js";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import { IDB_CONFIG_DATASTORE } from "../idb/config.js";
import { idb_store_ensure } from "../idb/store.js";
import { cl_datastore_error } from "./error.js";
import type {
    IClientDatastore,
    IClientDatastoreDelPrefResolve,
    IClientDatastoreDelResolve,
    IClientDatastoreKeyMap,
    IClientDatastoreKeyParamMap
} from "./types.js";

const DEFAULT_IDB_CONFIG: IdbClientConfig = IDB_CONFIG_DATASTORE;

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
    private store_ready: Promise<void> | null = null;
    private _key_map: Tk;
    private _key_param_map: Tp;
    private _key_obj_map: TkO;
    private crypto: WebCryptoService;
    private store_id: string;

    constructor(key_map: Tk, key_param_map: Tp, key_obj_map: TkO, config?: Partial<IdbClientConfig>) {
        this.db_name = config?.database ?? DEFAULT_IDB_CONFIG.database;
        this.store_name = config?.store ?? DEFAULT_IDB_CONFIG.store;
        this.store = null;
        this._key_map = key_map;
        this._key_param_map = key_param_map;
        this._key_obj_map = key_obj_map;
        this.store_id = `datastore:${this.db_name}:${this.store_name}`;
        this.crypto = new WebCryptoService();
        this.crypto.register_store_config({
            store_id: this.store_id,
            iv_length: 12
        });
    }

    private async get_store(): Promise<UseStore> {
        if (typeof indexedDB === "undefined") throw new Error(cl_datastore_error.idb_undefined);
        if (!this.store_ready) this.store_ready = idb_store_ensure(this.db_name, this.store_name);
        await this.store_ready;
        if (!this.store) this.store = createStore(this.db_name, this.store_name);
        return this.store;
    }

    private as_bytes(value: unknown): Uint8Array | null {
        if (value instanceof Uint8Array) return value;
        if (value instanceof ArrayBuffer) return new Uint8Array(value);
        if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        return null;
    }

    private async decrypt_value(store_key: string, stored: unknown): Promise<ResolveError<ResultObj<string>>> {
        if (typeof stored === "string") {
            const encrypted = await this.crypto.encrypt(this.store_id, text_enc(stored));
            const store = await this.get_store();
            await idb_set(store_key, encrypted, store);
            return { result: stored };
        }
        const bytes = this.as_bytes(stored);
        if (!bytes) return err_msg(cl_datastore_error.no_result);
        const outcome = await this.crypto.decrypt_record(this.store_id, bytes);
        if (outcome.reencrypted) {
            const store = await this.get_store();
            await idb_set(store_key, outcome.reencrypted, store);
        }
        return { result: text_dec(outcome.plaintext) };
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.db_name,
            store: this.store_name,
        };
    }

    public get_store_id(): string {
        return this.store_id;
    }

    public async init(): Promise<ResolveError<void>> {
        try {
            await this.get_store();
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set(key: keyof Tk, value: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            const encrypted = await this.crypto.encrypt(this.store_id, text_enc(value));
            const store = await this.get_store();
            await idb_set(this._key_map[key], encrypted, store);
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get(key: keyof Tk): Promise<ResolveError<ResultObj<string>>> {
        try {
            const store_key = this._key_map[key];
            const store = await this.get_store();
            const value = await idb_get(store_key, store);
            if (!value) return err_msg(cl_datastore_error.no_result);
            return await this.decrypt_value(store_key, value);
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del(key: keyof Tk): Promise<IClientDatastoreDelResolve> {
        try {
            const store = await this.get_store();
            await idb_del(this._key_map[key], store);
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set_obj<T>(key: keyof TkO, value: T): Promise<ResolveError<ResultObj<T>>> {
        try {
            const serialized = JSON.stringify(value);
            const encrypted = await this.crypto.encrypt(this.store_id, text_enc(serialized));
            const store = await this.get_store();
            await idb_set(this._key_obj_map[key], encrypted, store);
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async update_obj<T extends Record<string, unknown>>(key: keyof TkO, value: Partial<T>): Promise<ResolveError<ResultObj<T>>> {
        try {
            const store = await this.get_store();
            const k = this._key_obj_map[key];
            const obj_curr: Record<string, unknown> = {};
            const curr = await idb_get(k, store);
            if (curr) {
                const decrypted = await this.decrypt_value(k, curr);
                if ("err" in decrypted) return decrypted;
                const parsed: unknown = JSON.parse(decrypted.result);
                if (is_record(parsed)) for (const [curr_key, curr_val] of Object.entries(parsed)) obj_curr[curr_key] = curr_val;
            }
            const obj: T = { ...obj_curr, ...value } as T;
            const serialized = JSON.stringify(obj);
            const encrypted = await this.crypto.encrypt(this.store_id, text_enc(serialized));
            await idb_set(k, encrypted, store);
            return { result: obj };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async get_obj<T>(key: keyof TkO): Promise<ResolveError<ResultObj<T>>> {
        try {
            const store_key = this._key_obj_map[key];
            const store = await this.get_store();
            const value = await idb_get(store_key, store);
            if (!value) return err_msg(cl_datastore_error.no_result);
            const decrypted = await this.decrypt_value(store_key, value);
            if ("err" in decrypted) return decrypted;
            return { result: JSON.parse(decrypted.result) };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_obj(key: keyof TkO): Promise<ResolveError<ResultObj<string>>> {
        try {
            const store = await this.get_store();
            await idb_del(this._key_obj_map[key], store);
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
            const store_key = this._key_param_map[key](key_param);
            const encrypted = await this.crypto.encrypt(this.store_id, text_enc(value));
            const store = await this.get_store();
            await idb_set(store_key, encrypted, store);
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
            const store_key = this._key_param_map[key](key_param);
            const store = await this.get_store();
            const value = await idb_get(store_key, store);
            if (!value) return err_msg(cl_datastore_error.no_result);
            return await this.decrypt_value(store_key, value);
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve> {
        try {
            const store = await this.get_store();
            const all_keys = await idb_keys(store);
            const filtered_keys = all_keys.filter((k): k is string => (typeof k === "string" && k.startsWith(key_prefix)));
            for (const key of filtered_keys) {
                await idb_del(key, store);
            }
            return { results: filtered_keys };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<ResolveError<ResultsList<string>>> {
        try {
            const store = await this.get_store();
            const all_keys = await idb_keys(store);
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async export_backup(): Promise<ResolveError<BackupDatastorePayload>> {
        try {
            const store = await this.get_store();
            const all_keys = await idb_keys(store);
            const entries: BackupDatastorePayload["entries"] = [];
            for (const key of all_keys) {
                if (typeof key !== "string") continue;
                const value = await idb_get(key, store);
                if (!value) continue;
                const decrypted = await this.decrypt_value(key, value);
                if ("err" in decrypted) return decrypted;
                entries.push({ key, value: decrypted.result });
            }
            return { entries };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async import_backup(payload: BackupDatastorePayload): Promise<ResolveError<void>> {
        try {
            const store = await this.get_store();
            for (const entry of payload.entries) {
                const encrypted = await this.crypto.encrypt(this.store_id, text_enc(entry.value));
                await idb_set(entry.key, encrypted, store);
            }
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ResolveError<ResultPass>> {
        try {
            const store = await this.get_store();
            await idb_clear(store);
            const index = await crypto_registry_get_store_index(this.store_id);
            if (index) {
                await crypto_registry_clear_store_index(this.store_id);
                for (const key_id of index.key_ids) await crypto_registry_clear_key_entry(key_id);
            }
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

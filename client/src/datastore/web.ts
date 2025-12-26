import { err_msg, handle_err, text_dec, text_enc, type IdbClientConfig, type ResolveError, type ResultObj, type ResultPass, type ResultsList } from "@radroots/utils";
import { clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import type { BackupDatastorePayload } from "../backup/types.js";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import { WebEncryptedStore } from "../idb/encrypted_store.js";
import { IDB_CONFIG_DATASTORE } from "../idb/config.js";
import { idb_value_as_bytes } from "../idb/value.js";
import { is_error } from "../utils/resolve.js";
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
    private readonly encrypted_store: WebEncryptedStore;
    private readonly store_id: string;
    private _key_map: Tk;
    private _key_param_map: Tp;
    private _key_obj_map: TkO;

    constructor(key_map: Tk, key_param_map: Tp, key_obj_map: TkO, config?: Partial<IdbClientConfig>) {
        const idb_config: IdbClientConfig = {
            database: config?.database ?? DEFAULT_IDB_CONFIG.database,
            store: config?.store ?? DEFAULT_IDB_CONFIG.store
        };
        this.store_id = `datastore:${idb_config.database}:${idb_config.store}`;
        this.encrypted_store = new WebEncryptedStore({
            idb_config,
            store_id: this.store_id,
            idb_error: cl_datastore_error.idb_undefined,
            iv_length: 12
        });
        this._key_map = key_map;
        this._key_param_map = key_param_map;
        this._key_obj_map = key_obj_map;
    }

    private async get_store(): Promise<ResolveError<UseStore>> {
        return await this.encrypted_store.get_store();
    }

    private async decrypt_value(store_key: string, stored: unknown): Promise<ResolveError<ResultObj<string>>> {
        if (typeof stored === "string") {
            const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(stored));
            if (is_error(encrypted)) return encrypted;
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_set(store_key, encrypted, store);
            return { result: stored };
        }
        const bytes = idb_value_as_bytes(stored);
        if (!bytes) return err_msg(cl_datastore_error.no_result);
        const outcome = await this.encrypted_store.decrypt_record(bytes);
        if (is_error(outcome)) return outcome;
        if (outcome.reencrypted) {
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_set(store_key, outcome.reencrypted, store);
        }
        return { result: text_dec(outcome.plaintext) };
    }

    public get_config(): IdbClientConfig {
        return this.encrypted_store.get_config();
    }

    public get_store_id(): string {
        return this.store_id;
    }

    public async init(): Promise<ResolveError<void>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set(key: keyof Tk, value: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(value));
            if (is_error(encrypted)) return encrypted;
            const store = await this.get_store();
            if (is_error(store)) return store;
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
            if (is_error(store)) return store;
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
            if (is_error(store)) return store;
            await idb_del(this._key_map[key], store);
            return { result: key.toString() };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async set_obj<T>(key: keyof TkO, value: T): Promise<ResolveError<ResultObj<T>>> {
        try {
            const serialized = JSON.stringify(value);
            const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(serialized));
            if (is_error(encrypted)) return encrypted;
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_set(this._key_obj_map[key], encrypted, store);
            return { result: value };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async update_obj<T extends Record<string, unknown>>(key: keyof TkO, value: Partial<T>): Promise<ResolveError<ResultObj<T>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const k = this._key_obj_map[key];
            const obj_curr: Record<string, unknown> = {};
            const curr = await idb_get(k, store);
            if (curr) {
                const decrypted = await this.decrypt_value(k, curr);
                if (is_error(decrypted)) return decrypted;
                const parsed: unknown = JSON.parse(decrypted.result);
                if (is_record(parsed)) for (const [curr_key, curr_val] of Object.entries(parsed)) obj_curr[curr_key] = curr_val;
            }
            const obj: T = { ...obj_curr, ...value } as T;
            const serialized = JSON.stringify(obj);
            const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(serialized));
            if (is_error(encrypted)) return encrypted;
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
            if (is_error(store)) return store;
            const value = await idb_get(store_key, store);
            if (!value) return err_msg(cl_datastore_error.no_result);
            const decrypted = await this.decrypt_value(store_key, value);
            if (is_error(decrypted)) return decrypted;
            return { result: JSON.parse(decrypted.result) };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_obj(key: keyof TkO): Promise<ResolveError<ResultObj<string>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
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
            const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(value));
            if (is_error(encrypted)) return encrypted;
            const store = await this.get_store();
            if (is_error(store)) return store;
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
            if (is_error(store)) return store;
            const value = await idb_get(store_key, store);
            if (!value) return err_msg(cl_datastore_error.no_result);
            return await this.decrypt_value(store_key, value);
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<ResolveError<ResultsList<string>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            const pref = all_keys.filter((k): k is string => typeof k === "string" && k.startsWith(key_prefix));
            for (const key of pref) await idb_del(key, store);
            return { results: pref };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async entries(): Promise<ResolveError<ResultsList<[string, string | null]>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            const out: [string, string | null][] = [];
            for (const key of all_keys) {
                if (typeof key !== "string") continue;
                const value = await idb_get(key, store);
                if (!value) {
                    out.push([key, null]);
                    continue;
                }
                if (typeof value === "string") {
                    out.push([key, value]);
                    continue;
                }
                const decrypted = await this.decrypt_value(key, value);
                if (is_error(decrypted)) return decrypted;
                out.push([key, decrypted.result]);
            }
            return { results: out };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ResolveError<ResultPass>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_clear(store);
            const index = await crypto_registry_get_store_index(this.store_id);
            if (is_error(index)) return index;
            if (index) {
                const cleared = await crypto_registry_clear_store_index(this.store_id);
                if (is_error(cleared)) return cleared;
                for (const key_id of index.key_ids) {
                    const res = await crypto_registry_clear_key_entry(key_id);
                    if (is_error(res)) return res;
                }
            }
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async export_backup(): Promise<ResolveError<BackupDatastorePayload>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            const entries: BackupDatastorePayload["entries"] = [];
            for (const key of all_keys) {
                if (typeof key !== "string") continue;
                const stored = await idb_get(key, store);
                if (!stored) return err_msg(cl_datastore_error.no_result);
                const decrypted = await this.decrypt_value(key, stored);
                if (is_error(decrypted)) return decrypted;
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
            if (is_error(store)) return store;
            for (const entry of payload.entries) {
                const encrypted = await this.encrypted_store.encrypt_bytes(text_enc(entry.value));
                if (is_error(encrypted)) return encrypted;
                await idb_set(entry.key, encrypted, store);
            }
            return;
        } catch (e) {
            return handle_err(e);
        }
    }
}

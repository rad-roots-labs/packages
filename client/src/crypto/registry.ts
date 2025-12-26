import { createStore, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import { err_msg, handle_err, type IdbClientConfig, type ResolveError } from "@radroots/utils";
import { IDB_CONFIG_CRYPTO_REGISTRY } from "../idb/config.js";
import { idb_store_ensure } from "../idb/store.js";
import { is_error } from "../utils/resolve.js";
import { cl_crypto_error } from "./error.js";
import type { CryptoKeyEntry, CryptoRegistryExport, CryptoStoreIndex } from "./types.js";

const CRYPTO_IDB_CONFIG: IdbClientConfig = IDB_CONFIG_CRYPTO_REGISTRY;

let crypto_store: UseStore | null = null;
const STORE_INDEX_PREFIX = "store:";
const KEY_ENTRY_PREFIX = "key:";
const DEVICE_MATERIAL_KEY = "device:material";

const ensure_idb = async (): Promise<ResolveError<void>> => {
    if (typeof indexedDB === "undefined") return err_msg(cl_crypto_error.idb_undefined);
    try {
        await idb_store_ensure(CRYPTO_IDB_CONFIG.database, CRYPTO_IDB_CONFIG.store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

const get_crypto_store = async (): Promise<ResolveError<UseStore>> => {
    const ensured = await ensure_idb();
    if (is_error(ensured)) return ensured;
    if (!crypto_store) crypto_store = createStore(CRYPTO_IDB_CONFIG.database, CRYPTO_IDB_CONFIG.store);
    return crypto_store;
};

const store_index_key = (store_id: string): string => `${STORE_INDEX_PREFIX}${store_id}`;
const key_entry_key = (key_id: string): string => `${KEY_ENTRY_PREFIX}${key_id}`;

const is_string_array = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_crypto_store_index = (value: unknown): value is CryptoStoreIndex => {
    if (!is_record(value)) return false;
    return typeof value.store_id === "string"
        && typeof value.active_key_id === "string"
        && typeof value.created_at === "number"
        && is_string_array(value.key_ids);
};

const is_crypto_key_entry = (value: unknown): value is CryptoKeyEntry => {
    if (!is_record(value)) return false;
    return typeof value.key_id === "string"
        && typeof value.store_id === "string"
        && typeof value.created_at === "number"
        && typeof value.status === "string"
        && value.wrapped_key instanceof Uint8Array
        && value.wrap_iv instanceof Uint8Array
        && value.kdf_salt instanceof Uint8Array
        && typeof value.kdf_iterations === "number"
        && typeof value.iv_length === "number"
        && typeof value.algorithm === "string"
        && typeof value.provider_id === "string";
};

export const crypto_registry_get_store_index = async (store_id: string): Promise<ResolveError<CryptoStoreIndex | null>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        const record = await idb_get(store_index_key(store_id), store);
        if (!record) return null;
        if (!is_crypto_store_index(record)) return err_msg(cl_crypto_error.registry_failure);
        return record;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_set_store_index = async (index: CryptoStoreIndex): Promise<ResolveError<void>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        await idb_set(store_index_key(index.store_id), index, store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_get_key_entry = async (key_id: string): Promise<ResolveError<CryptoKeyEntry | null>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        const record = await idb_get(key_entry_key(key_id), store);
        if (!record) return null;
        if (!is_crypto_key_entry(record)) return err_msg(cl_crypto_error.registry_failure);
        return record;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_set_key_entry = async (entry: CryptoKeyEntry): Promise<ResolveError<void>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        await idb_set(key_entry_key(entry.key_id), entry, store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_list_store_indices = async (): Promise<ResolveError<CryptoStoreIndex[]>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        const keys = await idb_keys(store);
        const store_keys = keys.filter((key): key is string => typeof key === "string" && key.startsWith(STORE_INDEX_PREFIX));
        const out: CryptoStoreIndex[] = [];
        for (const key of store_keys) {
            const record = await idb_get(key, store);
            if (!record) continue;
            if (!is_crypto_store_index(record)) return err_msg(cl_crypto_error.registry_failure);
            out.push(record);
        }
        return out;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_list_key_entries = async (): Promise<ResolveError<CryptoKeyEntry[]>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        const keys = await idb_keys(store);
        const entry_keys = keys.filter((key): key is string => typeof key === "string" && key.startsWith(KEY_ENTRY_PREFIX));
        const out: CryptoKeyEntry[] = [];
        for (const key of entry_keys) {
            const record = await idb_get(key, store);
            if (!record) continue;
            if (!is_crypto_key_entry(record)) return err_msg(cl_crypto_error.registry_failure);
            out.push(record);
        }
        return out;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_export = async (): Promise<ResolveError<CryptoRegistryExport>> => {
    const stores = await crypto_registry_list_store_indices();
    if (is_error(stores)) return stores;
    const keys = await crypto_registry_list_key_entries();
    if (is_error(keys)) return keys;
    return { stores, keys };
};

export const crypto_registry_import = async (registry: CryptoRegistryExport): Promise<ResolveError<void>> => {
    const store = await get_crypto_store();
    if (is_error(store)) return store;
    for (const store_index of registry.stores) {
        const res = await crypto_registry_set_store_index(store_index);
        if (is_error(res)) return res;
    }
    for (const entry of registry.keys) {
        const res = await crypto_registry_set_key_entry(entry);
        if (is_error(res)) return res;
    }
    return;
};

export const crypto_registry_get_device_material = async (): Promise<ResolveError<Uint8Array | null>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        const record = await idb_get(DEVICE_MATERIAL_KEY, store);
        if (!record) return null;
        if (record instanceof Uint8Array) return record;
        if (record instanceof ArrayBuffer) return new Uint8Array(record);
        if (ArrayBuffer.isView(record)) return new Uint8Array(record.buffer, record.byteOffset, record.byteLength);
        return err_msg(cl_crypto_error.registry_failure);
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_set_device_material = async (material: Uint8Array): Promise<ResolveError<void>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        await idb_set(DEVICE_MATERIAL_KEY, material, store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_clear_store_index = async (store_id: string): Promise<ResolveError<void>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        await idb_del(store_index_key(store_id), store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

export const crypto_registry_clear_key_entry = async (key_id: string): Promise<ResolveError<void>> => {
    try {
        const store = await get_crypto_store();
        if (is_error(store)) return store;
        await idb_del(key_entry_key(key_id), store);
        return;
    } catch (e) {
        return handle_err(e);
    }
};

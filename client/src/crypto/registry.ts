import { createStore, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set } from "idb-keyval";
import type { IdbClientConfig } from "@radroots/utils";
import { cl_crypto_error } from "./error.js";
import type { CryptoKeyEntry, CryptoRegistryExport, CryptoStoreIndex } from "./types.js";

const CRYPTO_IDB_CONFIG: IdbClientConfig = {
    database: "radroots-client-crypto",
    store: "default"
};

const CRYPTO_STORE = createStore(CRYPTO_IDB_CONFIG.database, CRYPTO_IDB_CONFIG.store);
const STORE_INDEX_PREFIX = "store:";
const KEY_ENTRY_PREFIX = "key:";
const DEVICE_MATERIAL_KEY = "device:material";

const ensure_idb = (): void => {
    if (typeof indexedDB === "undefined") throw new Error(cl_crypto_error.idb_undefined);
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

export const crypto_registry_get_store_index = async (store_id: string): Promise<CryptoStoreIndex | null> => {
    ensure_idb();
    const record = await idb_get(store_index_key(store_id), CRYPTO_STORE);
    if (!record) return null;
    if (!is_crypto_store_index(record)) throw new Error(cl_crypto_error.registry_failure);
    return record;
};

export const crypto_registry_set_store_index = async (index: CryptoStoreIndex): Promise<void> => {
    ensure_idb();
    await idb_set(store_index_key(index.store_id), index, CRYPTO_STORE);
};

export const crypto_registry_get_key_entry = async (key_id: string): Promise<CryptoKeyEntry | null> => {
    ensure_idb();
    const record = await idb_get(key_entry_key(key_id), CRYPTO_STORE);
    if (!record) return null;
    if (!is_crypto_key_entry(record)) throw new Error(cl_crypto_error.registry_failure);
    return record;
};

export const crypto_registry_set_key_entry = async (entry: CryptoKeyEntry): Promise<void> => {
    ensure_idb();
    await idb_set(key_entry_key(entry.key_id), entry, CRYPTO_STORE);
};

export const crypto_registry_list_store_indices = async (): Promise<CryptoStoreIndex[]> => {
    ensure_idb();
    const keys = await idb_keys(CRYPTO_STORE);
    const store_keys = keys.filter((key): key is string => typeof key === "string" && key.startsWith(STORE_INDEX_PREFIX));
    const out: CryptoStoreIndex[] = [];
    for (const key of store_keys) {
        const record = await idb_get(key, CRYPTO_STORE);
        if (!record) continue;
        if (!is_crypto_store_index(record)) throw new Error(cl_crypto_error.registry_failure);
        out.push(record);
    }
    return out;
};

export const crypto_registry_list_key_entries = async (): Promise<CryptoKeyEntry[]> => {
    ensure_idb();
    const keys = await idb_keys(CRYPTO_STORE);
    const entry_keys = keys.filter((key): key is string => typeof key === "string" && key.startsWith(KEY_ENTRY_PREFIX));
    const out: CryptoKeyEntry[] = [];
    for (const key of entry_keys) {
        const record = await idb_get(key, CRYPTO_STORE);
        if (!record) continue;
        if (!is_crypto_key_entry(record)) throw new Error(cl_crypto_error.registry_failure);
        out.push(record);
    }
    return out;
};

export const crypto_registry_export = async (): Promise<CryptoRegistryExport> => {
    const stores = await crypto_registry_list_store_indices();
    const keys = await crypto_registry_list_key_entries();
    return { stores, keys };
};

export const crypto_registry_import = async (registry: CryptoRegistryExport): Promise<void> => {
    ensure_idb();
    for (const store of registry.stores) await crypto_registry_set_store_index(store);
    for (const entry of registry.keys) await crypto_registry_set_key_entry(entry);
};

export const crypto_registry_get_device_material = async (): Promise<Uint8Array | null> => {
    ensure_idb();
    const record = await idb_get(DEVICE_MATERIAL_KEY, CRYPTO_STORE);
    if (!record) return null;
    if (record instanceof Uint8Array) return record;
    if (record instanceof ArrayBuffer) return new Uint8Array(record);
    if (ArrayBuffer.isView(record)) return new Uint8Array(record.buffer, record.byteOffset, record.byteLength);
    throw new Error(cl_crypto_error.registry_failure);
};

export const crypto_registry_set_device_material = async (material: Uint8Array): Promise<void> => {
    ensure_idb();
    await idb_set(DEVICE_MATERIAL_KEY, material, CRYPTO_STORE);
};

export const crypto_registry_clear_store_index = async (store_id: string): Promise<void> => {
    ensure_idb();
    await idb_del(store_index_key(store_id), CRYPTO_STORE);
};

export const crypto_registry_clear_key_entry = async (key_id: string): Promise<void> => {
    ensure_idb();
    await idb_del(key_entry_key(key_id), CRYPTO_STORE);
};

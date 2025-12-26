import {
    IDB_STORE_CIPHER_AES_GCM,
    IDB_STORE_CIPHER_SQL,
    IDB_STORE_CIPHER_SUFFIX,
    IDB_STORE_CRYPTO_REGISTRY,
    IDB_STORE_DATASTORE,
    IDB_STORE_KEYSTORE,
    IDB_STORE_KEYSTORE_NOSTR,
    IDB_STORE_TANGLE,
    RADROOTS_IDB_DATABASE
} from "./config.js";

const RADROOTS_IDB_STORES = [
    IDB_STORE_DATASTORE,
    IDB_STORE_KEYSTORE,
    IDB_STORE_KEYSTORE_NOSTR,
    IDB_STORE_CRYPTO_REGISTRY,
    IDB_STORE_CIPHER_AES_GCM,
    IDB_STORE_CIPHER_SQL,
    IDB_STORE_TANGLE,
    `${IDB_STORE_KEYSTORE}${IDB_STORE_CIPHER_SUFFIX}`,
    `${IDB_STORE_KEYSTORE_NOSTR}${IDB_STORE_CIPHER_SUFFIX}`
];

const idb_missing_stores = (db: IDBDatabase, stores: string[]): string[] =>
    stores.filter((store) => !db.objectStoreNames.contains(store));

const idb_database_exists = async (database: string): Promise<boolean> => {
    if (typeof indexedDB === "undefined") return false;
    const list_fn = indexedDB.databases;
    if (typeof list_fn !== "function") return true;
    try {
        const entries = await list_fn.call(indexedDB);
        return entries.some((entry) => entry.name === database);
    } catch {
        return true;
    }
};

const idb_open = (database: string, version?: number, stores?: string[]): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(database, version);
        request.onupgradeneeded = () => {
            if (!stores || stores.length === 0) return;
            const db = request.result;
            for (const store of stores) {
                if (!db.objectStoreNames.contains(store)) db.createObjectStore(store);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            if (request.error) reject(request.error);
            else reject(new Error("idb_open_failed"));
        };
    });

const idb_store_ensure_all = async (database: string, stores: string[]): Promise<void> => {
    if (stores.length === 0) return;
    const target_stores = Array.from(new Set(stores));
    let attempt = 0;
    while (attempt < 5) {
        attempt++;
        const db = await idb_open(database);
        const missing = idb_missing_stores(db, target_stores);
        const version = db.version;
        if (missing.length === 0) {
            db.close();
            return;
        }
        db.close();
        try {
            const upgraded = await idb_open(database, version + 1, missing);
            const still_missing = idb_missing_stores(upgraded, target_stores);
            upgraded.close();
            if (still_missing.length === 0) return;
        } catch (e) {
            if (e instanceof DOMException && e.name === "VersionError") continue;
            throw e;
        }
    }
};

export const idb_store_ensure = async (database: string, store: string): Promise<void> => {
    if (typeof indexedDB === "undefined") return;
    await idb_store_ensure_all(database, [store]);
};

export const idb_store_bootstrap = async (database: string, stores?: string[]): Promise<void> => {
    if (typeof indexedDB === "undefined") return;
    const target_stores = stores ?? (database === RADROOTS_IDB_DATABASE ? RADROOTS_IDB_STORES : []);
    if (target_stores.length === 0) return;
    await idb_store_ensure_all(database, target_stores);
};

export const idb_store_exists = async (database: string, store: string): Promise<boolean> => {
    if (typeof indexedDB === "undefined") return false;
    const known = await idb_database_exists(database);
    if (!known) return false;
    try {
        const db = await idb_open(database);
        const exists = db.objectStoreNames.contains(store);
        db.close();
        return exists;
    } catch {
        return false;
    }
};

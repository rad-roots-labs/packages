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

export const idb_store_ensure = async (database: string, store: string): Promise<void> => {
    if (typeof indexedDB === "undefined") return;
    const target_stores = database === RADROOTS_IDB_DATABASE
        ? Array.from(new Set([...RADROOTS_IDB_STORES, store]))
        : [store];
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

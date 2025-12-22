import type { IdbClientConfig } from "@radroots/utils";

export const RADROOTS_IDB_DATABASE = "radroots-pwa-v1";

export const IDB_STORE_DATASTORE = "radroots.app.datastore";
export const IDB_STORE_KEYSTORE = "radroots.security.keystore";
export const IDB_STORE_KEYSTORE_NOSTR = "radroots.security.keystore.nostr";
export const IDB_STORE_CRYPTO_REGISTRY = "radroots.security.crypto.registry";
export const IDB_STORE_CIPHER_AES_GCM = "radroots.security.cipher.aes-gcm";
export const IDB_STORE_CIPHER_SQL = "radroots.security.cipher.sql";
export const IDB_STORE_TANGLE = "radroots.storage.tangle.sql";
export const IDB_STORE_CIPHER_SUFFIX = ".cipher";

export const IDB_CONFIG_DATASTORE: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_DATASTORE
};

export const IDB_CONFIG_KEYSTORE: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_KEYSTORE
};

export const IDB_CONFIG_KEYSTORE_NOSTR: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_KEYSTORE_NOSTR
};

export const IDB_CONFIG_CRYPTO_REGISTRY: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_CRYPTO_REGISTRY
};

export const IDB_CONFIG_CIPHER_AES_GCM: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_CIPHER_AES_GCM
};

export const IDB_CONFIG_CIPHER_SQL: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_CIPHER_SQL
};

export const IDB_CONFIG_TANGLE: IdbClientConfig = {
    database: RADROOTS_IDB_DATABASE,
    store: IDB_STORE_TANGLE
};

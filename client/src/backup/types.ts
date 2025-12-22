import type { ResolveError } from "@radroots/utils";
import type { CryptoRegistryExport } from "../crypto/types.js";

export type BackupBundleVersion = 1;

export type BackupBundleStoreType = "sql" | "keystore" | "datastore";

export type BackupSqlPayload = {
    bytes_b64: string;
};

export type BackupKeystoreEntry = {
    key: string;
    value: string;
};

export type BackupKeystorePayload = {
    entries: BackupKeystoreEntry[];
};

export type BackupDatastoreEntry = {
    key: string;
    value: string;
};

export type BackupDatastorePayload = {
    entries: BackupDatastoreEntry[];
};

export type BackupBundlePayload =
    | {
        store_id: string;
        store_type: "sql";
        data: BackupSqlPayload;
    }
    | {
        store_id: string;
        store_type: "keystore";
        data: BackupKeystorePayload;
    }
    | {
        store_id: string;
        store_type: "datastore";
        data: BackupDatastorePayload;
    };

export type BackupBundleManifest = {
    version: BackupBundleVersion;
    created_at: number;
    app_version?: string;
    stores: { store_id: string; store_type: BackupBundleStoreType; }[];
    crypto_registry: CryptoRegistryExport;
};

export type BackupBundle = {
    manifest: BackupBundleManifest;
    payloads: BackupBundlePayload[];
};

export type BackupBundleEnvelope = {
    version: number;
    created_at: number;
    kdf_salt_b64: string;
    kdf_iterations: number;
    iv_b64: string;
    ciphertext_b64: string;
};

export interface BackupSqlStore {
    export_backup(): Promise<ResolveError<BackupSqlPayload>>;
    import_backup(payload: BackupSqlPayload): Promise<ResolveError<void>>;
    get_store_id(): string;
}

export interface BackupKeystoreStore {
    export_backup(): Promise<ResolveError<BackupKeystorePayload>>;
    import_backup(payload: BackupKeystorePayload): Promise<ResolveError<void>>;
    get_store_id(): string;
}

export interface BackupDatastoreStore {
    export_backup(): Promise<ResolveError<BackupDatastorePayload>>;
    import_backup(payload: BackupDatastorePayload): Promise<ResolveError<void>>;
    get_store_id(): string;
}

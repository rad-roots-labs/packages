import type { IdbClientConfig, ResolveError } from "@radroots/utils";

export type CryptoKeyStatus = "active" | "rotated";

export type CryptoEnvelope = {
    version: number;
    key_id: string;
    iv: Uint8Array;
    created_at: number;
    ciphertext: Uint8Array;
};

export type CryptoKeyEntry = {
    key_id: string;
    store_id: string;
    created_at: number;
    status: CryptoKeyStatus;
    wrapped_key: Uint8Array;
    wrap_iv: Uint8Array;
    kdf_salt: Uint8Array;
    kdf_iterations: number;
    iv_length: number;
    algorithm: "AES-GCM";
    provider_id: string;
};

export type CryptoStoreIndex = {
    store_id: string;
    active_key_id: string;
    key_ids: string[];
    created_at: number;
};

export type CryptoRegistryExport = {
    stores: CryptoStoreIndex[];
    keys: CryptoKeyEntry[];
};

export type CryptoDecryptOutcome = {
    plaintext: Uint8Array;
    needs_reencrypt: boolean;
    reencrypted?: Uint8Array;
};

export type LegacyKeyConfig = {
    idb_config: IdbClientConfig;
    key_name: string;
    iv_length: number;
    algorithm: string;
};

export type CryptoStoreConfig = {
    store_id: string;
    legacy_key?: LegacyKeyConfig;
    iv_length?: number;
};

export interface KeyMaterialProvider {
    get_key_material(): Promise<Uint8Array>;
    get_provider_id(): Promise<string>;
}

export interface IWebCryptoService {
    register_store_config(config: CryptoStoreConfig): void;
    encrypt(store_id: string, plaintext: Uint8Array): Promise<ResolveError<Uint8Array>>;
    decrypt(store_id: string, blob: Uint8Array): Promise<ResolveError<Uint8Array>>;
    decrypt_record(store_id: string, blob: Uint8Array): Promise<ResolveError<CryptoDecryptOutcome>>;
    rotate_store_key(store_id: string): Promise<ResolveError<string>>;
    export_registry(): Promise<ResolveError<CryptoRegistryExport>>;
    import_registry(registry: CryptoRegistryExport): Promise<ResolveError<void>>;
}

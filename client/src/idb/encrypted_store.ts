import { err_msg, handle_err, type IdbClientConfig, type ResolveError } from "@radroots/utils";
import { createStore, type UseStore } from "idb-keyval";
import type { CryptoDecryptOutcome, CryptoStoreConfig, IWebCryptoService, LegacyKeyConfig } from "../crypto/types.js";
import { WebCryptoService } from "../crypto/service.js";
import { idb_store_ensure } from "./store.js";

export type WebEncryptedStoreConfig = {
    idb_config: IdbClientConfig;
    store_id: string;
    idb_error: string;
    legacy_key?: LegacyKeyConfig | null;
    iv_length?: number;
    crypto_service?: IWebCryptoService;
};

export interface IWebEncryptedStore {
    get_config(): IdbClientConfig;
    get_store_id(): string;
    get_store(): Promise<ResolveError<UseStore>>;
    encrypt_bytes(bytes: Uint8Array): Promise<ResolveError<Uint8Array>>;
    decrypt_record(blob: Uint8Array): Promise<ResolveError<CryptoDecryptOutcome>>;
}

export class WebEncryptedStore implements IWebEncryptedStore {
    private readonly config: IdbClientConfig;
    private readonly store_id: string;
    private readonly idb_error: string;
    private readonly crypto: IWebCryptoService;
    private store: UseStore | null = null;
    private store_ready: Promise<void> | null = null;

    constructor(config: WebEncryptedStoreConfig) {
        this.config = config.idb_config;
        this.store_id = config.store_id;
        this.idb_error = config.idb_error;
        this.crypto = config.crypto_service ?? new WebCryptoService();
        const store_config: CryptoStoreConfig = {
            store_id: this.store_id,
            iv_length: config.iv_length
        };
        if (config.legacy_key) store_config.legacy_key = config.legacy_key;
        this.crypto.register_store_config(store_config);
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.config.database,
            store: this.config.store
        };
    }

    public get_store_id(): string {
        return this.store_id;
    }

    public async get_store(): Promise<ResolveError<UseStore>> {
        if (typeof indexedDB === "undefined") return err_msg(this.idb_error);
        try {
            if (!this.store_ready) this.store_ready = idb_store_ensure(this.config.database, this.config.store);
            await this.store_ready;
            if (!this.store) this.store = createStore(this.config.database, this.config.store);
            return this.store;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async encrypt_bytes(bytes: Uint8Array): Promise<ResolveError<Uint8Array>> {
        return await this.crypto.encrypt(this.store_id, bytes);
    }

    public async decrypt_record(blob: Uint8Array): Promise<ResolveError<CryptoDecryptOutcome>> {
        return await this.crypto.decrypt_record(this.store_id, blob);
    }
}

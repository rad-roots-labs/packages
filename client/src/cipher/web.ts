import { type IdbClientConfig } from "@radroots/utils";
import { createStore, del as idb_del, type UseStore } from "idb-keyval";
import type { WebAesGcmCipherConfig } from "../keystore/web.js";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import { WebCryptoService } from "../crypto/service.js";
import type { LegacyKeyConfig } from "../crypto/types.js";
import { IDB_CONFIG_CIPHER_AES_GCM } from "../idb/config.js";
import { cl_cipher_error } from "./error.js";
import type { IClientCipher } from "./types.js";

const DEFAULT_IDB_CONFIG: IdbClientConfig = IDB_CONFIG_CIPHER_AES_GCM;

const DEFAULT_WEB_AES_GCM_CONFIG = {
    key_name: "radroots.aes-gcm.key",
    algorithm: "AES-GCM",
    key_length: 256,
    iv_length: 12
} as const;

export interface IWebAesGcmCipher extends IClientCipher { }

export class WebAesGcmCipher implements IWebAesGcmCipher {
    private readonly db_name: string;
    private readonly store_name: string;
    private readonly key_name: string;
    private readonly algorithm_name: string;
    private readonly iv_length: number;
    private readonly legacy_store: UseStore;
    private readonly store_id: string;
    private readonly crypto: WebCryptoService;
    private readonly legacy_key_config: LegacyKeyConfig;

    constructor(config?: WebAesGcmCipherConfig) {
        const idb_config = config?.idb_config ?? {};
        this.db_name = idb_config.database ?? DEFAULT_IDB_CONFIG.database;
        this.store_name = idb_config.store ?? DEFAULT_IDB_CONFIG.store;
        this.key_name = config?.key_name ?? DEFAULT_WEB_AES_GCM_CONFIG.key_name;
        this.algorithm_name = config?.algorithm ?? DEFAULT_WEB_AES_GCM_CONFIG.algorithm;
        this.iv_length = Number.isInteger(config?.iv_length) && (config?.iv_length ?? 0) > 0
            ? config?.iv_length ?? DEFAULT_WEB_AES_GCM_CONFIG.iv_length
            : DEFAULT_WEB_AES_GCM_CONFIG.iv_length;

        if (typeof indexedDB === "undefined") throw new Error(cl_cipher_error.idb_undefined);
        if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_cipher_error.crypto_undefined);

        this.legacy_store = createStore(this.db_name, this.store_name);
        this.store_id = this.key_name;
        this.crypto = new WebCryptoService();
        this.legacy_key_config = {
            idb_config: {
                database: this.db_name,
                store: this.store_name
            },
            key_name: this.key_name,
            iv_length: this.iv_length,
            algorithm: this.algorithm_name
        };
        this.crypto.register_store_config({
            store_id: this.store_id,
            legacy_key: this.legacy_key_config,
            iv_length: this.iv_length
        });
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.db_name,
            store: this.store_name
        };
    }

    public async reset(): Promise<void> {
        const index = await crypto_registry_get_store_index(this.store_id);
        if (index) {
            await crypto_registry_clear_store_index(this.store_id);
            for (const key_id of index.key_ids) await crypto_registry_clear_key_entry(key_id);
        }
        await idb_del(this.key_name, this.legacy_store);
    }

    public async encrypt(data: Uint8Array): Promise<Uint8Array> {
        return await this.crypto.encrypt(this.store_id, data);
    }

    public async decrypt(blob: Uint8Array): Promise<Uint8Array> {
        if (blob.byteLength <= this.iv_length) throw new Error(cl_cipher_error.invalid_ciphertext);
        const outcome = await this.crypto.decrypt_record(this.store_id, blob);
        return outcome.plaintext;
    }
}

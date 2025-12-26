import { err_msg, handle_err, type IdbClientConfig, type ResolveError } from "@radroots/utils";
import { createStore, del as idb_del, type UseStore } from "idb-keyval";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import { WebCryptoService } from "../crypto/service.js";
import type { LegacyKeyConfig } from "../crypto/types.js";
import { IDB_CONFIG_CIPHER_AES_GCM } from "../idb/config.js";
import { idb_store_ensure, idb_store_exists } from "../idb/store.js";
import { is_error } from "../utils/resolve.js";
import { cl_cipher_error } from "./error.js";
import type { ClientCipherDecryptResolve, ClientCipherEncryptResolve, ClientCipherResetResolve, IClientCipher, WebAesGcmCipherConfig } from "./types.js";

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
    private legacy_store: UseStore | null;
    private readonly store_id: string;
    private readonly crypto: WebCryptoService;
    private readonly legacy_key_config: LegacyKeyConfig;
    private store_ready: Promise<void> | null = null;

    constructor(config?: WebAesGcmCipherConfig) {
        const idb_config = config?.idb_config ?? {};
        this.db_name = idb_config.database ?? DEFAULT_IDB_CONFIG.database;
        this.store_name = idb_config.store ?? DEFAULT_IDB_CONFIG.store;
        this.key_name = config?.key_name ?? DEFAULT_WEB_AES_GCM_CONFIG.key_name;
        this.algorithm_name = config?.algorithm ?? DEFAULT_WEB_AES_GCM_CONFIG.algorithm;
        this.iv_length = Number.isInteger(config?.iv_length) && (config?.iv_length ?? 0) > 0
            ? config?.iv_length ?? DEFAULT_WEB_AES_GCM_CONFIG.iv_length
            : DEFAULT_WEB_AES_GCM_CONFIG.iv_length;

        this.legacy_store = null;
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

    private ensure_env(): ResolveError<void> {
        if (typeof indexedDB === "undefined") return err_msg(cl_cipher_error.idb_undefined);
        if (!globalThis.crypto || !globalThis.crypto.subtle) return err_msg(cl_cipher_error.crypto_undefined);
        return;
    }

    private async get_store(): Promise<ResolveError<UseStore>> {
        const env_err = this.ensure_env();
        if (env_err) return env_err;
        try {
            if (!this.store_ready) this.store_ready = idb_store_ensure(this.db_name, this.store_name);
            await this.store_ready;
            if (!this.legacy_store) this.legacy_store = createStore(this.db_name, this.store_name);
            return this.legacy_store;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ClientCipherResetResolve> {
        const env_err = this.ensure_env();
        if (env_err) return env_err;
        try {
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
            const has_store = await idb_store_exists(this.db_name, this.store_name);
            if (has_store) {
                const store = await this.get_store();
                if (is_error(store)) return store;
                await idb_del(this.key_name, store);
            }
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async encrypt(data: Uint8Array): Promise<ClientCipherEncryptResolve> {
        const env_err = this.ensure_env();
        if (env_err) return env_err;
        return await this.crypto.encrypt(this.store_id, data);
    }

    public async decrypt(blob: Uint8Array): Promise<ClientCipherDecryptResolve> {
        const env_err = this.ensure_env();
        if (env_err) return env_err;
        if (blob.byteLength <= this.iv_length) return err_msg(cl_cipher_error.invalid_ciphertext);
        const outcome = await this.crypto.decrypt_record(this.store_id, blob);
        if (is_error(outcome)) return outcome;
        return outcome.plaintext;
    }
}

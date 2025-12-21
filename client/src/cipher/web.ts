import { as_array_buffer, type IdbClientConfig } from "@radroots/utils";
import { createStore, del as idb_del, get as idb_get, set as idb_set, type UseStore } from "idb-keyval";
import { type WebAesGcmCipherConfig } from "../keystore/web.js";
import { cl_cipher_error } from "./error.js";
import type { IClientCipher } from "./types.js";

const DEFAULT_IDB_CONFIG: IdbClientConfig = {
    database: "radroots-aes-gcm-keystore",
    store: "default"
};

const DEFAULT_WEB_AES_GCM_CONFIG = {
    key_name: "radroots.aes-gcm.key",
    algorithm: "AES-GCM",
    key_length: 256,
    iv_length: 12
} as const;

const DEFAULT_KEY_USAGES: KeyUsage[] = ["encrypt", "decrypt"];

export interface IWebAesGcmCipher extends IClientCipher { }

export class WebAesGcmCipher implements IWebAesGcmCipher {
    private readonly db_name: string;
    private readonly store_name: string;
    private readonly key_name: string;
    private readonly algorithm_name: string;
    private readonly key_usages: readonly KeyUsage[];
    private readonly iv_length: number;
    private readonly key_length: number;
    private readonly store: UseStore;
    private cached_key: CryptoKey | null;
    private key_promise: Promise<CryptoKey> | null;

    constructor(config?: WebAesGcmCipherConfig) {
        const idb_config = config?.idb_config ?? {};
        this.db_name = idb_config.database ?? DEFAULT_IDB_CONFIG.database;
        this.store_name = idb_config.store ?? DEFAULT_IDB_CONFIG.store;
        this.key_name = config?.key_name ?? DEFAULT_WEB_AES_GCM_CONFIG.key_name;
        this.algorithm_name = config?.algorithm ?? DEFAULT_WEB_AES_GCM_CONFIG.algorithm;
        this.key_usages = DEFAULT_KEY_USAGES;
        this.iv_length = Number.isInteger(config?.iv_length) && (config?.iv_length ?? 0) > 0
            ? config?.iv_length ?? DEFAULT_WEB_AES_GCM_CONFIG.iv_length
            : DEFAULT_WEB_AES_GCM_CONFIG.iv_length;
        this.key_length = Number.isInteger(config?.key_length) && (config?.key_length ?? 0) > 0
            ? config?.key_length ?? DEFAULT_WEB_AES_GCM_CONFIG.key_length
            : DEFAULT_WEB_AES_GCM_CONFIG.key_length;

        if (typeof indexedDB === "undefined") throw new Error(cl_cipher_error.idb_undefined);
        if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_cipher_error.crypto_undefined);

        this.store = createStore(this.db_name, this.store_name);
        this.cached_key = null;
        this.key_promise = null;
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.db_name,
            store: this.store_name
        };
    }

    private async import_key(raw_key: Uint8Array): Promise<CryptoKey> {
        const key_usages: KeyUsage[] = [...this.key_usages];
        const key = await crypto.subtle.importKey(
            "raw",
            as_array_buffer(raw_key),
            this.algorithm_name,
            false,
            key_usages
        );
        return key;
    }

    private async persist_key(key: CryptoKey): Promise<void> {
        try {
            await idb_set(this.key_name, key, this.store);
        } catch {
            const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
            try {
                await idb_set(this.key_name, raw, this.store);
            } finally {
                raw.fill(0);
            }
        }
    }

    private async generate_and_persist_key(): Promise<CryptoKey> {
        const key = await crypto.subtle.generateKey(
            { name: this.algorithm_name, length: this.key_length },
            false,
            this.key_usages
        );
        await this.persist_key(key);
        return key;
    }

    private async resolve_persisted_key(): Promise<CryptoKey | null> {
        const stored = await idb_get(this.key_name, this.store);
        if (!stored) return null;
        if (stored instanceof CryptoKey) return stored;
        if (stored instanceof Uint8Array) return this.import_key(stored);
        if (ArrayBuffer.isView(stored) && stored.buffer instanceof ArrayBuffer) {
            const slice = new Uint8Array(stored.buffer, stored.byteOffset, stored.byteLength);
            const bytes = new Uint8Array(slice);
            return this.import_key(bytes);
        }
        return null;
    }

    private async load_key(): Promise<CryptoKey> {
        if (this.cached_key) return this.cached_key;
        if (this.key_promise) return this.key_promise;
        this.key_promise = this.inner_load_key();
        const key = await this.key_promise;
        this.cached_key = key;
        this.key_promise = null;
        return key;
    }

    private async inner_load_key(): Promise<CryptoKey> {
        const existing = await this.resolve_persisted_key();
        if (existing) return existing;
        return this.generate_and_persist_key();
    }

    public async reset(): Promise<void> {
        this.cached_key = null;
        this.key_promise = null;
        await idb_del(this.key_name, this.store);
    }

    public async encrypt(data: Uint8Array): Promise<Uint8Array> {
        if (data.byteLength === 0) return data;
        const key = await this.load_key();
        const iv = crypto.getRandomValues(new Uint8Array(this.iv_length));
        const ciphertext_buffer = await crypto.subtle.encrypt(
            { name: this.algorithm_name, iv: as_array_buffer(iv) },
            key,
            as_array_buffer(data)
        );
        const ciphertext = new Uint8Array(ciphertext_buffer);
        const out = new Uint8Array(this.iv_length + ciphertext.byteLength);
        out.set(iv, 0);
        out.set(ciphertext, this.iv_length);
        return out;
    }

    public async decrypt(blob: Uint8Array): Promise<Uint8Array> {
        if (blob.byteLength <= this.iv_length) throw new Error(cl_cipher_error.invalid_ciphertext);
        const key = await this.load_key();
        const iv = blob.slice(0, this.iv_length);
        const ciphertext = blob.slice(this.iv_length);
        try {
            const plaintext = await crypto.subtle.decrypt(
                { name: this.algorithm_name, iv: as_array_buffer(iv) },
                key,
                as_array_buffer(ciphertext)
            );
            return new Uint8Array(plaintext);
        } catch {
            throw new Error(cl_cipher_error.decrypt_failure);
        }
    }
}

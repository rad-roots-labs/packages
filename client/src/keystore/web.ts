import {
    err_msg,
    handle_err,
    IdbClientConfig,
    text_dec,
    text_enc,
    type ResolveError,
    type ResultObj,
    type ResultPass,
    type ResultsList
} from "@radroots/utils";
import { createStore, clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import type { BackupKeystorePayload } from "../backup/types.js";
import { WebCryptoService } from "../crypto/service.js";
import type { LegacyKeyConfig } from "../crypto/types.js";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import { IDB_CONFIG_KEYSTORE, IDB_STORE_CIPHER_SUFFIX } from "../idb/config.js";
import { cl_keystore_error } from "./error.js";
import type { IClientKeystore, IClientKeystoreValue } from "./types.js";

export type WebAesGcmCipherConfig = {
    idb_config?: Partial<IdbClientConfig>;
    key_name?: string;
    key_length?: number;
    iv_length?: number;
    algorithm?: string;
};

export interface IWebKeystore extends IClientKeystore {
    get_config(): IdbClientConfig;
    get_store_id(): string;
    export_backup(): Promise<ResolveError<BackupKeystorePayload>>;
    import_backup(payload: BackupKeystorePayload): Promise<ResolveError<void>>;
}

export class WebKeystore implements IWebKeystore {
    private config: IdbClientConfig;
    private store: UseStore | null;
    private crypto: WebCryptoService;
    private store_id: string;
    private legacy_key_config: LegacyKeyConfig;

    constructor(config?: Partial<IdbClientConfig>) {
        this.config = {
            database: config?.database ?? IDB_CONFIG_KEYSTORE.database,
            store: config?.store ?? IDB_CONFIG_KEYSTORE.store
        };
        this.store = null;
        this.store_id = `keystore:${this.config.database}:${this.config.store}`;
        this.crypto = new WebCryptoService();
        const legacy_store = `${this.config.store}${IDB_STORE_CIPHER_SUFFIX}`;

        this.legacy_key_config = {
            idb_config: {
                database: this.config.database,
                store: legacy_store
            },
            key_name: `radroots.keystore.${this.config.store}.aes-gcm.key`,
            iv_length: 12,
            algorithm: "AES-GCM"
        };

        this.crypto.register_store_config({
            store_id: this.store_id,
            legacy_key: this.legacy_key_config,
            iv_length: 12
        });
    }

    private get_store(): UseStore {
        if (!this.store) {
            if (typeof indexedDB === "undefined") throw new Error(cl_keystore_error.idb_undefined);
            this.store = createStore(this.config.database, this.config.store);
        }
        return this.store;
    }

    private as_bytes(value: unknown): Uint8Array | null {
        if (value instanceof Uint8Array) return value;
        if (value instanceof ArrayBuffer) return new Uint8Array(value);
        if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        return null;
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

    public async add(key: string, value: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            const bytes = text_enc(value);
            const cipher_bytes = await this.crypto.encrypt(this.store_id, bytes);
            await idb_set(key, cipher_bytes, this.get_store());
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async remove(key: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            await idb_del(key, this.get_store());
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async read(key?: string | null): Promise<ResolveError<ResultObj<IClientKeystoreValue>>> {
        try {
            if (!key) return err_msg(cl_keystore_error.missing_key);
            const cipher_value = await idb_get(key, this.get_store());
            const cipher_bytes = this.as_bytes(cipher_value);
            if (!cipher_bytes) return err_msg(cl_keystore_error.corrupt_data);
            const outcome = await this.crypto.decrypt_record(this.store_id, cipher_bytes);
            if (outcome.reencrypted) await idb_set(key, outcome.reencrypted, this.get_store());
            const plain = text_dec(outcome.plaintext);
            return { result: plain };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<ResolveError<ResultsList<string>>> {
        try {
            const all_keys = await idb_keys(this.get_store());
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async export_backup(): Promise<ResolveError<BackupKeystorePayload>> {
        try {
            const all_keys = await idb_keys(this.get_store());
            const entries: BackupKeystorePayload["entries"] = [];
            for (const key of all_keys) {
                if (typeof key !== "string") continue;
                const value = await this.read(key);
                if ("err" in value) return value;
                if (typeof value.result !== "string") return err_msg(cl_keystore_error.corrupt_data);
                entries.push({ key, value: value.result });
            }
            return { entries };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async import_backup(payload: BackupKeystorePayload): Promise<ResolveError<void>> {
        try {
            for (const entry of payload.entries) {
                const res = await this.add(entry.key, entry.value);
                if ("err" in res) return res;
            }
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ResolveError<ResultPass>> {
        try {
            await idb_clear(this.get_store());
            const index = await crypto_registry_get_store_index(this.store_id);
            if (index) {
                await crypto_registry_clear_store_index(this.store_id);
                for (const key_id of index.key_ids) await crypto_registry_clear_key_entry(key_id);
            }
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

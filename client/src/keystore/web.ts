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
import { clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import type { BackupKeystorePayload } from "../backup/types.js";
import { crypto_registry_clear_key_entry, crypto_registry_clear_store_index, crypto_registry_get_store_index } from "../crypto/registry.js";
import type { LegacyKeyConfig } from "../crypto/types.js";
import { WebEncryptedStore } from "../idb/encrypted_store.js";
import { IDB_CONFIG_KEYSTORE, IDB_STORE_CIPHER_SUFFIX } from "../idb/config.js";
import { idb_value_as_bytes } from "../idb/value.js";
import { is_error } from "../utils/resolve.js";
import { cl_keystore_error } from "./error.js";
import type { IClientKeystore, IClientKeystoreValue } from "./types.js";

export interface IWebKeystore extends IClientKeystore {
    get_config(): IdbClientConfig;
    get_store_id(): string;
    export_backup(): Promise<ResolveError<BackupKeystorePayload>>;
    import_backup(payload: BackupKeystorePayload): Promise<ResolveError<void>>;
}

export class WebKeystore implements IWebKeystore {
    private config: IdbClientConfig;
    private store_id: string;
    private encrypted_store: WebEncryptedStore;
    private legacy_key_config: LegacyKeyConfig;

    constructor(config?: Partial<IdbClientConfig>) {
        this.config = {
            database: config?.database ?? IDB_CONFIG_KEYSTORE.database,
            store: config?.store ?? IDB_CONFIG_KEYSTORE.store
        };
        this.store_id = `keystore:${this.config.database}:${this.config.store}`;
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

        this.encrypted_store = new WebEncryptedStore({
            idb_config: this.config,
            store_id: this.store_id,
            idb_error: cl_keystore_error.idb_undefined,
            legacy_key: this.legacy_key_config,
            iv_length: 12
        });
    }

    private async get_store(): Promise<ResolveError<UseStore>> {
        return await this.encrypted_store.get_store();
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
            const cipher_bytes = await this.encrypted_store.encrypt_bytes(bytes);
            if (is_error(cipher_bytes)) return cipher_bytes;
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_set(key, cipher_bytes, store);
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async remove(key: string): Promise<ResolveError<ResultObj<string>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_del(key, store);
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async read(key?: string | null): Promise<ResolveError<ResultObj<IClientKeystoreValue>>> {
        try {
            if (!key) return err_msg(cl_keystore_error.missing_key);
            const store = await this.get_store();
            if (is_error(store)) return store;
            const cipher_value = await idb_get(key, store);
            const cipher_bytes = idb_value_as_bytes(cipher_value);
            if (!cipher_bytes) return err_msg(cl_keystore_error.corrupt_data);
            const outcome = await this.encrypted_store.decrypt_record(cipher_bytes);
            if (is_error(outcome)) return outcome;
            if (outcome.reencrypted) await idb_set(key, outcome.reencrypted, store);
            const plain = text_dec(outcome.plaintext);
            return { result: plain };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys(): Promise<ResolveError<ResultsList<string>>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async export_backup(): Promise<ResolveError<BackupKeystorePayload>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            const all_keys = await idb_keys(store);
            const entries: BackupKeystorePayload["entries"] = [];
            for (const key of all_keys) {
                if (typeof key !== "string") continue;
                const value = await this.read(key);
                if (is_error(value)) return value;
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
            const store = await this.get_store();
            if (is_error(store)) return store;
            for (const entry of payload.entries) {
                const res = await this.add(entry.key, entry.value);
                if (is_error(res)) return res;
            }
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset(): Promise<ResolveError<ResultPass>> {
        try {
            const store = await this.get_store();
            if (is_error(store)) return store;
            await idb_clear(store);
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
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

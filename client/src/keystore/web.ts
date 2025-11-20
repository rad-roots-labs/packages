import { err_msg, handle_err, IdbClientConfig, text_dec, text_enc } from "@radroots/utils";
import { createStore, clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import { WebAesGcmCipher, type WebAesGcmCipherConfig } from "../cipher/web.js";
import type { IClientKeystore } from "./types.js";

export class WebKeystore implements IClientKeystore {
    private config: IdbClientConfig;
    private store: UseStore | null;
    private cipher: WebAesGcmCipher;

    constructor(config?: IdbClientConfig) {
        this.config = {
            database: config?.database || "radroots-web-keystore",
            store: config?.store || "default"
        };
        this.store = null;

        const cipher_config: WebAesGcmCipherConfig = {
            idb_config: {
                database: `${this.config.database}-cipher`,
                store: this.config.store
            },
            key_name: `radroots.keystore.${this.config.store}.aes-gcm.key`
        };

        this.cipher = new WebAesGcmCipher(cipher_config);
    }

    private get_store(): UseStore {
        if (!this.store) {
            if (typeof indexedDB === "undefined") {
                throw new Error("error.client.keystore.idb_undefined");
            }
            this.store = createStore(this.config.database, this.config.store);
        }
        return this.store;
    }

    public get_config(): IdbClientConfig {
        return {
            database: this.config.database,
            store: this.config.store
        };
    }

    public async add(key: string, value: string) {
        try {
            const bytes = text_enc(value);
            const cipher_bytes = await this.cipher.encrypt(bytes);
            await idb_set(key, cipher_bytes, this.get_store());
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async remove(key: string) {
        try {
            await idb_del(key, this.get_store());
            return { result: key };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async read(key?: string | null) {
        try {
            if (!key) {
                return err_msg("error.client.keystore.missing_key");
            }
            const cipher_bytes = await idb_get<Uint8Array | null>(key, this.get_store());
            if (!(cipher_bytes instanceof Uint8Array)) {
                return err_msg("error.client.keystore.corrupt_data");
            }
            const bytes = await this.cipher.decrypt(cipher_bytes);
            const plain = text_dec(bytes);
            return { result: plain };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async keys() {
        try {
            const all_keys = await idb_keys(this.get_store());
            return { results: all_keys.filter((k): k is string => typeof k === "string") };
        } catch (e) {
            return handle_err(e);
        }
    }

    public async reset() {
        try {
            await idb_clear(this.get_store());
            await this.cipher.reset();
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

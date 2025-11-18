import { err_msg, handle_err, text_dec, text_enc } from "@radroots/utils";
import { createStore, clear as idb_clear, del as idb_del, get as idb_get, keys as idb_keys, set as idb_set, type UseStore } from "idb-keyval";
import { type IClientIdbConfig } from "../utils/idb.js";
import { AesGcmKeystoreCipher } from "./aes-gcm-cipher.js";
import type { IClientKeystore } from "./types.js";


export class WebKeystore implements IClientKeystore {
    private db_name: string;
    private store_name: string;
    private store: UseStore | null = null;

    constructor(config?: IClientIdbConfig) {
        this.db_name = config?.database || "radroots-web-keystore";
        this.store_name = config?.store || "default";
        this.store = null;
        AesGcmKeystoreCipher.load_key();
    }

    private get_store(): UseStore {
        if (!this.store) {
            if (typeof indexedDB === "undefined") throw new Error("error.client.keystore.idb_undefined");
            this.store = createStore(this.db_name, this.store_name);
        }
        return this.store;
    }

    public async add(key: string, value: string) {
        try {
            const bytes = text_enc(value);
            const cipher = await AesGcmKeystoreCipher.encrypt(bytes);
            await idb_set(key, cipher, this.get_store());
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
            if (!key) return err_msg("error.client.keystore.missing_key");
            const cipher = await idb_get<Uint8Array | null>(key, this.get_store());
            if (!(cipher instanceof Uint8Array)) return err_msg("error.client.keystore.corrupt_data");
            const bytes = await AesGcmKeystoreCipher.decrypt(cipher);
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
            return { pass: true } as const;
        } catch (e) {
            return handle_err(e);
        }
    }
}

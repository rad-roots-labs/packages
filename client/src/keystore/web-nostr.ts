import { err_msg, handle_err, IdbClientConfig } from '@radroots/utils';
import { lib_nostr_key_generate, lib_nostr_public_key, lib_nostr_secret_key_validate } from '@radroots/utils-nostr';
import type { IClientKeystoreNostr } from './types.js';
import { WebKeystore } from './web.js';


export class WebKeystoreNostr implements IClientKeystoreNostr {
    private keystore_config: IdbClientConfig;
    private _keystore: WebKeystore;

    constructor(config?: Partial<IdbClientConfig>) {
        this.keystore_config = { database: config?.database || "radroots-web-keystore-nostr", store: config?.store || "default" };
        this._keystore = new WebKeystore(this.keystore_config);
    }

    private async add_secret_key(secret_key_raw: string) {
        const secret_key = lib_nostr_secret_key_validate(secret_key_raw);
        if (!secret_key) throw new Error("error.nostr.invalid_secret_key");
        const public_key = lib_nostr_public_key(secret_key);
        return await this._keystore.add(public_key, secret_key);
    }

    public get_config(): IdbClientConfig {
        return this._keystore.get_config();
    }

    public async generate() {
        try {
            const secret_key = lib_nostr_key_generate();
            const resolve = await this.add_secret_key(secret_key);
            if ("err" in resolve) return resolve;
            return { public_key: resolve.result };
        } catch (e) {
            return handle_err(e);
        }
    };

    public async add(secret_key_raw: string) {
        try {
            const resolve = await this.add_secret_key(secret_key_raw);
            if ("err" in resolve) return resolve;
            return { public_key: resolve.result };
        } catch (e) {
            return handle_err(e);
        }
    };

    public async read(public_key?: string) {
        try {
            const resolve = await this._keystore.read(public_key);
            if ("err" in resolve) return resolve;
            return { secret_key: resolve.result };
        } catch (e) {
            return handle_err(e);
        }
    };

    public async keys() {
        try {
            const resolve = await this._keystore.keys();
            if ("err" in resolve) return resolve;
            if (resolve.results.length) return resolve;
            return err_msg("error.client.keystore-nostr.no_results");
        } catch (e) {
            return handle_err(e);
        }
    };

    public async remove(public_key: string) {
        try {
            const resolve = await this._keystore.remove(public_key);
            if ("err" in resolve) return resolve;
            return { result: public_key };
        } catch (e) {
            return handle_err(e);
        }
    };

    public async reset() {
        try {
            const resolve = await this._keystore.reset();
            return resolve;
        } catch (e) {
            return handle_err(e);
        }
    };
}

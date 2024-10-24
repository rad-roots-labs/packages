import { err_msg, type ErrorMessage, type ResultObj, type ResultPass, type ResultsList } from '@radroots/utils';
import { load, Store } from '@tauri-apps/plugin-store';
import type { IClientUnlisten } from '../types';
import type { IClientKeystore } from './types';

export class TauriClientKeystore implements IClientKeystore {
    private _store: Store | null = null;
    private _store_path: string;

    constructor(store_path: string = 'store.json') {
        this._store_path = store_path;
    }

    public async init(): Promise<void> {
        this._store = await load(this._store_path);
    }

    public async set(key: string, value: string): Promise<ResultPass | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            await this._store.set(key, { value });
            await this._store.save();
            return { pass: true };
        } catch (e) {
            return err_msg(`*`);
        };
    }

    public async get(key: string): Promise<ResultObj<string> | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            const result = await this._store.get<{ value: any }>(key);
            if (result && typeof result.value === `string`) return { result: result.value };
            return err_msg(`*-result`);
        } catch (e) {
            return err_msg(`*`);
        };
    }

    public async remove(key: string): Promise<ResultPass | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            const res = await this._store.delete(key);
            if (!res) return err_msg(`*-pass`);
            await this._store.save();
            return { pass: true };
        } catch (e) {
            return err_msg(`*`);
        };
    }

    public async keys(): Promise<ResultsList<string> | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            const results = await this._store.keys();
            return { results };
        } catch (e) {
            return err_msg(`*`);
        };
    }

    public async entries(): Promise<ResultsList<[string, unknown]> | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            const results = await this._store.entries();
            return { results };
        } catch (e) {
            return err_msg(`*`);
        };
    }

    public async on_key_change(key: string, callback: (value: string | null) => Promise<void>): Promise<IClientUnlisten | ErrorMessage<string>> {
        try {
            if (!this._store) return err_msg(`*-store`);
            const res = await this._store.onKeyChange<{ value: any }>(key, async (res) => await callback(res && `value` in res ? String(res.value) : null));
            return res;
        } catch (e) {
            return err_msg(`*`);
        };
    }
}

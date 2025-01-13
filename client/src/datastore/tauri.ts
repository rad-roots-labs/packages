import { ds_map, ds_map_param, err_msg, type IClientDatastore, type IClientDatastoreEntriesResolve, type IClientDatastoreGetPResolve, type IClientDatastoreGetResolve, type IClientDatastoreKeysResolve, type IClientDatastoreRemoveResolve, type IClientDatastoreSetPResolve, type IClientDatastoreSetResolve } from '@radroots/utils';
import { load, Store } from '@tauri-apps/plugin-store';

export class TauriClientDatastore implements IClientDatastore {
    private _store: Store | null = null;
    private _store_path: string;

    constructor(store_path: string = 'radroots_datastore.json') {
        this._store_path = store_path;
    }

    public async init(): Promise<void> {
        this._store = await load(this._store_path);
    }

    public async set(key: keyof typeof ds_map, value: string): Promise<IClientDatastoreSetResolve> {
        if (!this._store) return err_msg(`*-store`);
        await this._store.set(ds_map[key], { value });
        await this._store.save();
        return { pass: true };
    }

    public async get(key: keyof typeof ds_map): Promise<IClientDatastoreGetResolve> {
        if (!this._store) return err_msg(`*-store`);
        const result = await this._store.get<{ value: any }>(ds_map[key]);
        if (result && typeof result.value === `string`) return { result: result.value };
        return err_msg(`*-result`);
    }

    public async setp(key: keyof typeof ds_map_param, key_param: string, value: string): Promise<IClientDatastoreSetPResolve> {
        if (!this._store) return err_msg(`*-store`);
        await this._store.set(ds_map_param[key](key_param), { value });
        await this._store.save();
        return { pass: true };
    }

    public async getp(key: keyof typeof ds_map_param, key_param: string): Promise<IClientDatastoreGetPResolve> {
        if (!this._store) return err_msg(`*-store`);
        const result = await this._store.get<{ value: any }>(ds_map_param[key](key_param));
        if (result && typeof result.value === `string`) return { result: result.value };
        return err_msg(`*-result`);
    }

    public async remove(key: keyof typeof ds_map): Promise<IClientDatastoreRemoveResolve> {
        if (!this._store) return err_msg(`*-store`);
        const res = await this._store.delete(ds_map[key]);
        if (!res) return err_msg(`*-pass`);
        await this._store.save();
        return { pass: true };
    }

    public async keys(): Promise<IClientDatastoreKeysResolve> {
        if (!this._store) return err_msg(`*-store`);
        const results = await this._store.keys();
        return { results };
    }

    public async entries(): Promise<IClientDatastoreEntriesResolve> {
        if (!this._store) return err_msg(`*-store`);
        const results = await this._store.entries();
        return { results };
    }
}

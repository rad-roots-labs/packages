import { browser } from "$app/environment";
import { _envLib } from "../_env";
import { fmt_id } from "../app/lib";
import { IdbKeyval } from "./idb";

export let idb_kv: IdbKeyval;
if (browser) idb_kv = new IdbKeyval({ name: _envLib.KEYVAL_NAME });

export const idb_kv_init = async (): Promise<void> => {
    if (!browser) return;
    const range = IdbKeyval.prefix(`*`);
    const idb_kv_list = await idb_kv.each({ range }, `keys`);
    await Promise.all(idb_kv_list.map((i) => idb_kv.delete(i)));
};

export const idb_kv_init_page = async (): Promise<void> => {
    if (!browser) return;
    const idb_kv_pref = fmt_id();
    const range = IdbKeyval.prefix(idb_kv_pref);
    const idb_kv_list = await idb_kv.each({ range }, `keys`);
    await Promise.all(idb_kv_list.map((i) => idb_kv.delete(i)));
};

export const idb_kv_sync = async (list: [string, string][]): Promise<void> => {
    if (!browser) return;
    for (const [key, val] of list) await idb_kv.set(key, val);
};

export class IdbLib<T extends string> {
    private _idb: IdbKeyval;

    constructor(kv: IdbKeyval) {
        this._idb = kv;
    }
    public init = async () => {
        await idb_kv_init_page();
    }

    public save = async (key: T, value: string) => {
        await this._idb.set(fmt_id(key), value);
    }

    public read = async (key: T): Promise<string | undefined> => {
        const result = await this._idb.get<string>(fmt_id(key));
        if (result) return result;
        return undefined;
    }

    public del = async (key: T) => {
        await this._idb.delete(fmt_id(key));
    }
}
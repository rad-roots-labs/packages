import { browser } from "$app/environment";
import { fmt_id, IdbKeyval } from "@radroots/apps-lib";
import { _env_lib } from "$lib/utils/_env";

export let idb_kv: IdbKeyval | undefined;
if (browser) idb_kv = new IdbKeyval({ name: _env_lib.KEYVAL_NAME });

export const idb_kv_init = async (): Promise<void> => {
    if (!browser || !idb_kv) return;
    const kv = idb_kv;
    const range = IdbKeyval.prefix(`*`);
    const idb_kv_list = await kv.each({ range }, `keys`);
    await Promise.all(idb_kv_list.map((i) => kv.delete(i)));
};

export const idb_kv_init_page = async (): Promise<void> => {
    if (!browser || !idb_kv) return;
    const kv = idb_kv;
    const idb_kv_pref = fmt_id();
    const range = IdbKeyval.prefix(idb_kv_pref);
    const idb_kv_list = await kv.each({ range }, `keys`);
    await Promise.all(idb_kv_list.map((i) => kv.delete(i)));
};

export const idb_kv_sync = async (list: [string, string][]): Promise<void> => {
    if (!browser || !idb_kv) return;
    const kv = idb_kv;
    for (const [key, val] of list) await kv.set(key, val);
};

export interface IIdbLib<T extends string> {
    init: () => Promise<void>;
    save: (key: T, value: string) => Promise<void>;
    read: (key: T) => Promise<string | undefined>;
    del: (key: T) => Promise<void>;
}

export class IdbLib<T extends string> implements IIdbLib<T> {
    private _idb: IdbKeyval;

    constructor(kv: IdbKeyval) {
        this._idb = kv;
    }

    public init = async (): Promise<void> => {
        await idb_kv_init_page();
    };

    public save = async (key: T, value: string): Promise<void> => {
        await this._idb.set(fmt_id(key), value);
    };

    public read = async (key: T): Promise<string | undefined> => {
        const result = await this._idb.get<string>(fmt_id(key));
        if (result) return result;
        return undefined;
    };

    public del = async (key: T): Promise<void> => {
        await this._idb.delete(fmt_id(key));
    };
}

import { browser } from "$app/environment";
import { fmt_id } from "../lib";

//@ts-ignore
const idb_name = import.meta.env.VITE_PUBLIC_IDB_NAME;
if (!idb_name) throw new Error('Error: VITE_PUBLIC_IDB_NAME is required');

export let idb: Keyva;
if (browser) idb = new Keyva({ name: idb_name });

export const idb_init = async (): Promise<void> => {
    if (!browser) return;
    const range = Keyva.prefix(`*`);
    const idb_list = await idb.each({ range }, `keys`);
    await Promise.all(idb_list.map((i) => idb.delete(i)));
};

export const idb_init_page = async (): Promise<void> => {
    if (!browser) return;
    const idb_pref = fmt_id();
    const range = Keyva.prefix(idb_pref);
    const idb_list = await idb.each({ range }, `keys`);
    await Promise.all(idb_list.map((i) => idb.delete(i)));
};

export const idb_sync = async (list: [string, string][]): Promise<void> => {
    if (!browser) return;
    for (const [key, val] of list) await idb.set(key, val);
};

export class IdbLib<T extends string> {
    private _idb: Keyva;

    constructor(kv: Keyva) {
        this._idb = kv;
    }
    public init = async () => {
        await idb_init_page();
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
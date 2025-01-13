import { browser } from "$app/environment";
import { fmt_id } from "$lib";

//@ts-ignore
const kv_name = import.meta.env.VITE_PUBLIC_KV_NAME;
if (!kv_name) throw new Error('Error: VITE_PUBLIC_KV_NAME is required');

export let kv_basis: Keyva;
if (browser) kv_basis = new Keyva({ name: kv_name });

export const kv_init = async (): Promise<void> => {
    if (!browser) return;
    const range = Keyva.prefix(`*`);
    const kv_list = await kv_basis.each({ range }, `keys`);
    await Promise.all(kv_list.map((i) => kv_basis.delete(i)));
};

export const kv_init_page = async (): Promise<void> => {
    if (!browser) return;
    const kv_pref = fmt_id();
    const range = Keyva.prefix(kv_pref);
    const kv_list = await kv_basis.each({ range }, `keys`);
    await Promise.all(kv_list.map((i) => kv_basis.delete(i)));
};

export const kv_sync = async (list: [string, string][]): Promise<void> => {
    if (!browser) return;
    for (const [key, val] of list) await kv_basis.set(key, val);
};

export class KvLib<T extends string> {
    private _kv: Keyva;

    constructor(kv: Keyva) {
        this._kv = kv;
    }
    public init = async () => {
        await kv_init_page();
    }

    public save = async (key: T, value: string) => {
        await this._kv.set(fmt_id(key), value);
    }

    public read = async (key: T): Promise<string | undefined> => {
        const result = await this._kv.get<string>(fmt_id(key));
        if (result) return result;
        return undefined;
    }

    public del = async (key: T) => {
        await this._kv.delete(fmt_id(key));
    }
}
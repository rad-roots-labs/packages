import { fmt_id, kv } from "$lib";

export const kv_init = async (): Promise<void> => {
    const range = Keyva.prefix(`*`);
    const kv_list = await kv.each({ range }, `keys`);
    await Promise.all(kv_list.map((i) => kv.delete(i)));
};

export const kv_init_page = async (): Promise<void> => {
    const kv_pref = fmt_id();
    const range = Keyva.prefix(kv_pref);
    const kv_list = await kv.each({ range }, `keys`);
    await Promise.all(kv_list.map((i) => kv.delete(i)));
};

export const kv_sync = async (list: [string, string][]): Promise<void> => {
    for (const [key, val] of list) await kv.set(key, val);
};


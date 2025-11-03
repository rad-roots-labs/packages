import { browser } from '$app/environment';
import { fmt_id } from '$lib';

const IDB_NAME = import.meta.env.VITE_PUBLIC_IDB_NAME;
if (!IDB_NAME) throw new Error('VITE_PUBLIC_IDB_NAME is required');

let _kv: Keyva | null = null;
export function get_idb(): Keyva {
    if (!browser) throw new Error('IndexedDB not available on server');
    if (!_kv) _kv = new Keyva({ name: IDB_NAME });
    return _kv;
}

export class IdbLib<
    CKey extends string,
    CMap extends Record<CKey, any>,
    SKey extends string,
    SMap extends Record<SKey, any>
> {
    private get kv(): Keyva {
        return get_idb();
    }

    public async save_global(key: CKey, value: CMap[CKey]): Promise<void> {
        await this.kv.set(key, value);
    }

    public async read_global<K extends CKey>(key: K): Promise<CMap[K] | undefined> {
        const result = await this.kv.get<CMap[K]>(key);
        return result ? result : undefined;
    }

    public async del_global(key: CKey): Promise<void> {
        await this.kv.delete(key);
    }

    public async list_global(): Promise<Array<[CKey, CMap[CKey]]>> {
        const entries = await this.kv.each<CMap[CKey]>();
        return entries.map(([rk, v]) => [rk as CKey, v]);
    }

    private keyof(key: SKey): string {
        return fmt_id(key);
    }

    public async save(key: SKey, value: SMap[SKey]): Promise<void> {
        await this.kv.set(this.keyof(key), value);
    }

    public async read(key: SKey): Promise<SMap[SKey] | undefined> {
        const result = await this.kv.get<SMap[SKey]>(this.keyof(key));
        return result ? result : undefined;
    }

    public async del(key: SKey): Promise<void> {
        await this.kv.delete(this.keyof(key));
    }

    public async list(): Promise<Array<[SKey, SMap[SKey]]>> {
        const prefix = fmt_id();
        const range = Keyva.prefix(prefix);
        const entries = await this.kv.each<SMap[SKey]>({ range });
        return entries.map(([rk, v]) => {
            const str = String(rk);
            const suffix = str.startsWith(prefix) ? str.slice(prefix.length) : str;
            return [suffix as SKey, v];
        });
    }

    public async clear_all(): Promise<void> {
        const range = Keyva.prefix('*');
        const keys = await this.kv.each({ range }, 'keys');
        if (keys.length) await Promise.all(keys.map((k) => this.kv.delete(k)));
    }

    public async clear_scope(): Promise<void> {
        const prefix = fmt_id();
        const range = Keyva.prefix(prefix);
        const keys = await this.kv.each({ range }, 'keys');
        if (keys.length) await Promise.all(keys.map((k) => this.kv.delete(k)));
    }

    public async sync_batch(entries: Array<[string, any]>): Promise<void> {
        if (entries.length) await this.kv.set(entries);
    }
}

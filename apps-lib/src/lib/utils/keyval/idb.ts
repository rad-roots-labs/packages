export interface IIdbKeyval {
    get<T = unknown>(key: IdbKeyval.Key): Promise<T>;
    get<T = unknown>(keys: IdbKeyval.Key[]): Promise<T[]>;
    each<T = unknown>(): Promise<[IdbKeyval.Key, T][]>;
    each<T = unknown>(options: IdbKeyval.IQuery): Promise<[IdbKeyval.Key, T][]>;
    each(options: IdbKeyval.IQuery, only: "keys"): Promise<IdbKeyval.Key[]>;
    each<T = unknown>(options: IdbKeyval.IQuery, only: "values"): Promise<T[]>;
    set(key: IdbKeyval.Key, value: unknown): Promise<void>;
    set(entries: [IdbKeyval.Key, unknown][]): Promise<void>;
    delete(): Promise<void>;
    delete(range: IDBKeyRange): Promise<void>;
    delete(key: IdbKeyval.Key): Promise<void>;
    delete(keys: IdbKeyval.Key[]): Promise<void>;
}

const is_entry_list = (
    value: IdbKeyval.Key | [IdbKeyval.Key, unknown][]
): value is [IdbKeyval.Key, unknown][] => {
    if (!Array.isArray(value)) return false;
    if (value.length === 0) return true;
    for (const entry of value) {
        if (!Array.isArray(entry)) return false;
        if (entry.length !== 2) return false;
    }
    return true;
};

export class IdbKeyval implements IIdbKeyval {
    static readonly UNBOUND = IDBKeyRange.lowerBound(Number.MIN_SAFE_INTEGER);

    static prefix(prefix: string): IDBKeyRange {
        return IDBKeyRange.bound(prefix, prefix + "\uFFFF");
    }

    static async each(): Promise<string[]> {
        const databases = await indexedDB.databases();
        return databases
            .map((db) => db.name)
            .filter((name): name is string => !!name && name.startsWith(this.KV_PREFIX));
    }

    static async delete(...names: string[]): Promise<void> {
        const resolved_names = names.length
            ? names.map((name) => (name.startsWith(this.KV_PREFIX) ? name : this.KV_PREFIX + name))
            : await this.each();

        await Promise.all(resolved_names.map((name) => this.as_promise(indexedDB.deleteDatabase(name))));
    }

    private static readonly KV_PREFIX = "radroots-web-keyval";

    constructor(options: IdbKeyval.IConstructorOptions = {}) {
        const idx = options.indexes || [];
        this.indexes = (Array.isArray(idx) ? idx : [idx]).sort();
        this.name = options.name?.toString() || IdbKeyval.KV_PREFIX;
    }

    private readonly indexes: string[];
    private readonly name: string;

    get<T = unknown>(key: IdbKeyval.Key): Promise<T>;
    get<T = unknown>(keys: IdbKeyval.Key[]): Promise<T[]>;
    async get<T = unknown>(k: IdbKeyval.Key | IdbKeyval.Key[]): Promise<T | T[]> {
        const store = await this.get_store("readonly");

        return Array.isArray(k)
            ? Promise.all(k.map((key) => IdbKeyval.as_promise<T>(store.get(key))))
            : IdbKeyval.as_promise<T>(store.get(k));
    }

    each<T = unknown>(): Promise<[IdbKeyval.Key, T][]>;
    each<T = unknown>(options: IdbKeyval.IQuery): Promise<[IdbKeyval.Key, T][]>;
    each(options: IdbKeyval.IQuery, only: "keys"): Promise<IdbKeyval.Key[]>;
    each<T = unknown>(options: IdbKeyval.IQuery, only: "values"): Promise<T[]>;
    async each<T = unknown>(
        options: IdbKeyval.IQuery = {},
        only?: "keys" | "values"
    ): Promise<[IdbKeyval.Key, T][] | IdbKeyval.Key[] | T[]> {
        const store = await this.get_store("readonly");
        const target = options.index ? store.index(options.index) : store;
        const limit = options.limit;
        const range = options.range;

        if (only === "keys") {
            return IdbKeyval.as_promise<IdbKeyval.Key[]>(target.getAllKeys(range, limit));
        }

        if (only === "values") {
            return IdbKeyval.as_promise<T[]>(target.getAll(range, limit));
        }

        const [keys, values] = await Promise.all([
            IdbKeyval.as_promise<IdbKeyval.Key[]>(target.getAllKeys(range, limit)),
            IdbKeyval.as_promise<T[]>(target.getAll(range, limit))
        ]);

        return keys.map<[IdbKeyval.Key, T]>((key, index) => [key, values[index]]);
    }

    async set(key: IdbKeyval.Key, value: unknown): Promise<void>;
    async set(entries: [IdbKeyval.Key, unknown][]): Promise<void>;
    async set(a: IdbKeyval.Key | [IdbKeyval.Key, unknown][], b?: unknown): Promise<void> {
        const store = await this.get_store("readwrite");
        if (is_entry_list(a)) {
            for (const [key, value] of a) {
                store.put(value, key);
            }

            return IdbKeyval.as_promise(store.transaction);
        }

        store.put(b, a);
        return IdbKeyval.as_promise(store.transaction);
    }

    async delete(): Promise<void>;
    async delete(range: IDBKeyRange): Promise<void>;
    async delete(key: IdbKeyval.Key): Promise<void>;
    async delete(keys: IdbKeyval.Key[]): Promise<void>;
    async delete(arg?: IdbKeyval.Key | IdbKeyval.Key[] | IDBKeyRange): Promise<void> {
        const store = await this.get_store("readwrite");
        const delete_arg = arg ?? IdbKeyval.UNBOUND;

        if (Array.isArray(delete_arg)) {
            for (const key of delete_arg) {
                store.delete(key);
            }
        } else {
            store.delete(delete_arg);
        }

        return IdbKeyval.as_promise(store.transaction);
    }

    private async get_store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.get_database();
        return db.transaction(this.name, mode).objectStore(this.name);
    }

    private async get_database(): Promise<IDBDatabase> {
        if (!this.database) {
            await this.maybe_fix_safari();
            let quit = false;
            let version: number | undefined;
            let index_names_added: string[] = [];
            let index_names_removed: string[] = [];

            for (;;) {
                const request = indexedDB.open(this.name, version);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    const tx = request.transaction;
                    if (!tx) return;

                    const store = tx.objectStoreNames.contains(this.name)
                        ? tx.objectStore(this.name)
                        : db.createObjectStore(this.name);

                    for (const index of index_names_added) {
                        store.createIndex(index, index);
                    }

                    for (const index of index_names_removed) {
                        store.deleteIndex(index);
                    }
                };
                this.database = await IdbKeyval.as_promise(request);

                if (quit) {
                    break;
                }

                const tx = this.database.transaction(this.name, "readonly");
                const store = tx.objectStore(this.name);
                const index_names = Array.from(store.indexNames).sort();
                tx.abort();

                index_names_added = this.indexes.filter((name) => !index_names.includes(name));
                index_names_removed = index_names.filter((name) => !this.indexes.includes(name));

                if (index_names_added.length + index_names_removed.length === 0) {
                    break;
                }

                quit = true;
                this.database.close();
                version = this.database.version + 1;
            }
        }

        return this.database;
    }

    private database: IDBDatabase | null = null;

    private async maybe_fix_safari(): Promise<void> {
        if (!/Version\/14\.\d*\s*Safari\//.test(navigator.userAgent)) {
            return;
        }

        let id: ReturnType<typeof setInterval> | undefined;
        await new Promise<void>((resolve) => {
            const hit = () => indexedDB.databases().finally(resolve);
            id = setInterval(hit, 50);
            hit();
        }).finally(() => {
            if (id) {
                clearInterval(id);
            }
        });
    }

    private static as_promise<T>(request: IDBRequest<T>): Promise<T>;
    private static as_promise(request: IDBTransaction): Promise<void>;
    private static as_promise<T>(request: IDBRequest<T> | IDBTransaction): Promise<T | void> {
        return new Promise<T | void>((resolve, reject) => {
            if ("onsuccess" in request) {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
                return;
            }

            request.oncomplete = () => resolve();
            request.onabort = () => reject(request.error);
            request.onerror = () => reject(request.error);
        });
    }
}

export namespace IdbKeyval {
    export interface IConstructorOptions {
        name?: string | number;
        indexes?: string | string[];
    }

    export interface IQuery {
        range?: IDBKeyRange;
        index?: string;
        limit?: number;
    }

    export type Key = IDBValidKey;
}

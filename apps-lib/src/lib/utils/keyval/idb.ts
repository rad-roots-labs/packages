export class IdbKeyval {
    static readonly unbound = IDBKeyRange.lowerBound(Number.MIN_SAFE_INTEGER);

    static prefix(prefix: string) {
        return IDBKeyRange.bound(prefix, prefix + "\uFFFF");
    }

    static async each() {
        const databases = await indexedDB.databases();
        return databases
            .map((db) => db.name)
            .filter((name): name is string => !!name && name.startsWith(this.kv_prefix));
    }

    static async delete(...names: string[]) {
        const resolved_names = names.length
            ? names.map((name) => (name.startsWith(this.kv_prefix) ? name : this.kv_prefix + name))
            : await this.each();

        Promise.all(resolved_names.map((name) => this.as_promise(indexedDB.deleteDatabase(name))));
    }

    private static readonly kv_prefix = "radroots-web-keyval";

    constructor(options: IdbKeyval.IConstructorOptions = {}) {
        const idx = options.indexes || [];
        this.indexes = (Array.isArray(idx) ? idx : [idx]).sort();
        this.name = options.name?.toString() || IdbKeyval.kv_prefix;
    }

    private readonly indexes: string[];
    private readonly name: string;

    get<T = any>(key: IdbKeyval.Key): Promise<T>;
    get<T = any>(keys: IdbKeyval.Key[]): Promise<T[]>;
    async get(k: IdbKeyval.Key | IdbKeyval.Key[]) {
        const store = await this.get_store("readonly");

        return Array.isArray(k)
            ? Promise.all(k.map((key) => IdbKeyval.as_promise(store.get(key))))
            : IdbKeyval.as_promise(store.get(k));
    }

    each<T = any>(): Promise<[IdbKeyval.Key, T][]>;
    each<T = any>(options: IdbKeyval.IQuery): Promise<[IdbKeyval.Key, T][]>;
    each(options: IdbKeyval.IQuery, only: "keys"): Promise<IdbKeyval.Key[]>;
    each<T = any>(options: IdbKeyval.IQuery, only: "values"): Promise<T[]>;
    async each(options: IdbKeyval.IQuery = {}, only?: "keys" | "values"): Promise<any> {
        const store = await this.get_store("readonly");
        const target = options.index ? store.index(options.index) : store;
        const limit = options.limit;
        const range = options.range;

        if (only === "keys") {
            return IdbKeyval.as_promise(target.getAllKeys(range, limit));
        }

        if (only === "values") {
            return IdbKeyval.as_promise(target.getAll(range, limit));
        }

        const keys: IdbKeyval.Key[] = [];
        const values: any[] = [];

        await Promise.allSettled([
            new Promise<void>(async (resolve) => {
                const results = await IdbKeyval.as_promise(target.getAllKeys(range, limit));
                keys.push(...(results as IdbKeyval.Key[]));
                resolve();
            }),
            new Promise<void>(async (resolve) => {
                const results = await IdbKeyval.as_promise(target.getAll(range, limit));
                values.push(...results);
                resolve();
            }),
        ]);

        const tuples: [IdbKeyval.Key, any][] = [];

        for (let i = -1; ++i < keys.length;) {
            tuples.push([keys[i], values[i]]);
        }

        return tuples;
    }

    async set(key: IdbKeyval.Key, value: any): Promise<void>;
    async set(entries: [IdbKeyval.Key, any][]): Promise<void>;
    async set(a: any, b?: any) {
        const store = await this.get_store("readwrite");
        if (Array.isArray(a)) {
            for (const entry of a as [IdbKeyval.Key, any][]) {
                store.put(entry[1], entry[0]);
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
    async delete(arg?: IdbKeyval.Key | IdbKeyval.Key[] | IDBKeyRange) {
        const store = await this.get_store("readwrite");
        const delete_arg = arg ?? IdbKeyval.unbound;

        if (Array.isArray(delete_arg)) {
            for (const key of delete_arg) {
                store.delete(key);
            }
        } else {
            store.delete(delete_arg);
        }

        return IdbKeyval.as_promise(store.transaction);
    }

    private async get_store(mode: IDBTransactionMode) {
        const db = await this.get_database();
        return db.transaction(this.name, mode).objectStore(this.name);
    }

    private async get_database() {
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
                    const tx = request.transaction as IDBTransaction;

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

    private async maybe_fix_safari() {
        if (!/Version\/14\.\d*\s*Safari\//.test(navigator.userAgent)) {
            return;
        }

        let id: ReturnType<typeof setInterval> | undefined;
        return new Promise<void>((resolve) => {
            const hit = () => indexedDB.databases().finally(resolve);
            id = setInterval(hit, 50);
            hit();
        }).finally(() => {
            if (id) {
                clearInterval(id);
            }
        });
    }

    private static as_promise<T = undefined>(request: IDBRequest<T> | IDBTransaction) {
        return new Promise<T>((resolve, reject) => {
            const req = request as IDBRequest<T> & IDBTransaction;
            req.oncomplete = req.onsuccess = () => resolve(req.result);
            req.onabort = req.onerror = () => reject(req.error);
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

    export type Key = string | number | Date | BufferSource;
}

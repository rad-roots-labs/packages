
export class IdbKeyval {
    /**
     * An IDBKeyRange that has no upper or lower bounding.
     */
    static readonly unbound = IDBKeyRange.lowerBound(Number.MIN_SAFE_INTEGER);

    /**
     * Returns an IDBKeyRange that matches all keys that start
     * with the specified string prefix.
     */
    static prefix(prefix: string) {
        return IDBKeyRange.bound(prefix, prefix + "\uFFFF");
    }

    /**
     * @returns An array of strings that contain the names of all 
     * IdbKeyval-created IndexedDB databases.
     */
    static async each() {
        const databases = await indexedDB.databases();
        return databases
            .map(db => db.name)
            .filter((s): s is string => !!s && s.startsWith(this.kv_prefix));
    }

    /**
     * Deletes IdbKeyval-created IndexedDB databases with the 
     * specified names.
     * 
     * @param names The names of the databases to delete. 
     * If no names are provided, all IdbKeyval IndexedDB databases 
     * are deleted.
     */
    static async delete(...names: string[]) {
        names = names.length ?
            names.map(n => n.startsWith(this.kv_prefix) ? n : this.kv_prefix + n) :
            await this.each();

        Promise.all(names.map(n => this.as_promise(indexedDB.deleteDatabase(n))));
    }

    /** Stores the prefix that is added to every IndexedDB database created by IdbKeyval. */
    private static readonly kv_prefix = "radroots-web-keyval";

    /**
     * Creates a new IndexedDB-backed database 
     */
    constructor(options: IdbKeyval.IConstructorOptions = {}) {
        const idx = options.indexes || [];
        this.indexes = (Array.isArray(idx) ? idx : [idx]).sort();
        this.name = options.name?.toString() || IdbKeyval.kv_prefix;
    }

    private readonly indexes: string[];
    private readonly name: string;

    /**
     * Get a value by its key.
     * @param key The key of the value to get.
     */
    get<T = any>(key: IdbKeyval.Key): Promise<T>;
    /**
     * Get a series of values from the keys specified.
     * @param keys The key of the value to get.
     */
    get<T = any>(keys: IdbKeyval.Key[]): Promise<T[]>;
    /** */
    async get(k: IdbKeyval.Key | IdbKeyval.Key[]) {
        const store = await this.get_store("readonly");

        return Array.isArray(k) ?
            Promise.all(k.map(key => IdbKeyval.as_promise(store.get(key)))) :
            IdbKeyval.as_promise(store.get(k));
    }

    /**
     * Gets all keys and values from the IdbKeyval database.
     * @param key The key of the value to get.
     */
    each<T = any>(): Promise<[IdbKeyval.Key, T][]>;
    /**
     * Gets a series of keys and values that match the specified
     * set of options.
     */
    each<T = any>(options: IdbKeyval.IQuery): Promise<[IdbKeyval.Key, T][]>;
    /**
     * Gets a series of keys only that match the specified set of options.
     */
    each(options: IdbKeyval.IQuery, only: "keys"): Promise<IdbKeyval.Key[]>;
    /**
     * Gets a series of values only that match the specified set of options.
     */
    each<T = any>(options: IdbKeyval.IQuery, only: "values"): Promise<T[]>;
    /** */
    async each(options: IdbKeyval.IQuery = {}, only?: "keys" | "values"): Promise<any> {
        const store = await this.get_store("readonly");
        const target = options.index ? store.index(options.index) : store;
        const limit = options.limit;
        const range = options.range;

        if (only === "keys")
            return IdbKeyval.as_promise(target.getAllKeys(range, limit));

        if (only === "values")
            return IdbKeyval.as_promise(target.getAll(range, limit));

        let keys: IdbKeyval.Key[] = [];
        let values: any[] = [];

        await Promise.allSettled([
            new Promise<void>(async r => {
                const results = await IdbKeyval.as_promise(target.getAllKeys(range, limit));
                keys.push(...results as IdbKeyval.Key[]);
                r();
            }),
            new Promise<void>(async r => {
                const results = await IdbKeyval.as_promise(target.getAll(range, limit));
                values.push(...results);
                r();
            }),
        ]);

        const tuples: [IdbKeyval.Key, any][] = [];

        for (let i = -1; ++i < keys.length;)
            tuples.push([keys[i], values[i]]);

        return tuples;
    }

    /**
     * Set a value with a key.
     */
    async set(key: IdbKeyval.Key, value: any): Promise<void>;
    /**
     * Set multiple values at once. This is faster than calling set() multiple times.
     * It's also atomic – if one of the pairs can't be added, none will be added.
     * @param entries Array of entries, where each entry is an array of `[key, value]`.
     */
    async set(entries: [IdbKeyval.Key, any][]): Promise<void>;
    async set(a: any, b?: any) {
        const store = await this.get_store("readwrite");
        if (Array.isArray(a)) {
            for (const entry of (a as [IdbKeyval.Key, any][]))
                store.put(entry[1], entry[0]);

            return IdbKeyval.as_promise(store.transaction);
        }

        store.put(b, a);
        return IdbKeyval.as_promise(store.transaction);
    }

    /**
     * Deletes all objects from this IdbKeyval database 
     * (but keeps the IdbKeyval database itself is kept).
     */
    async delete(): Promise<void>;
    /**
     * Delete a single object from the store with the specified key.
     */
    async delete(range: IDBKeyRange): Promise<void>;
    /**
     * Delete a single object from the store with the specified key.
     */
    async delete(key: IdbKeyval.Key): Promise<void>;
    /**
     * Delete a series of objects from the store at once, with the specified keys.
     */
    async delete(keys: IdbKeyval.Key[]): Promise<void>;
    async delete(arg?: IdbKeyval.Key | IdbKeyval.Key[] | IDBKeyRange) {
        const store = await this.get_store("readwrite");
        arg ??= IdbKeyval.unbound;

        if (Array.isArray(arg)) {
            for (const key of arg)
                store.delete(key);
        }
        else store.delete(arg);

        return IdbKeyval.as_promise(store.transaction);
    }

    /** */
    private async get_store(mode: IDBTransactionMode) {
        const db = await this.get_database();
        return db.transaction(this.name, mode).objectStore(this.name);
    }

    /** */
    private async get_database() {
        if (!this.database) {
            await this.maybe_fix_safari();
            let quit = false;
            let version: number | undefined;
            let indexNamesAdded: string[] = [];
            let indexNamesRemoved: string[] = [];

            for (; ;) {
                const request = indexedDB.open(this.name, version);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    const tx = request.transaction!;

                    const store = tx.objectStoreNames.contains(this.name) ?
                        tx.objectStore(this.name) :
                        db.createObjectStore(this.name);

                    for (const index of indexNamesAdded)
                        store.createIndex(index, index);

                    for (const index of indexNamesRemoved)
                        store.deleteIndex(index);
                };
                this.database = await IdbKeyval.as_promise(request);

                if (quit)
                    break;

                const tx = this.database.transaction(this.name, "readonly");
                const store = tx.objectStore(this.name);
                const indexNames = Array.from(store.indexNames).sort();
                tx.abort();

                indexNamesAdded = this.indexes.filter(n => !indexNames.includes(n));
                indexNamesRemoved = indexNames.filter(n => !this.indexes.includes(n));

                if (indexNamesAdded.length + indexNamesRemoved.length === 0)
                    break;

                quit = true;
                this.database.close();
                version = this.database.version + 1;
            }
        }

        return this.database;
    }
    private database: IDBDatabase | null = null;

    /**
     * Works around a Safari 14 bug.
     * 
     * Safari has a bug where IDB requests can hang while the browser is 
     * starting up. https://bugs.webkit.org/show_bug.cgi?id=226547
     * The only solution is to keep nudging it until it's awake.
     */
    private async maybe_fix_safari() {
        if (!/Version\/14\.\d*\s*Safari\//.test(navigator.userAgent))
            return;

        let id: any = 0;
        return new Promise<void>(resolve => {
            const hit = () => indexedDB.databases().finally(resolve);
            id = setInterval(hit, 50);
            hit();
        })
            .finally(() => clearInterval(id));
    }

    /** */
    private static as_promise<T = undefined>(request: IDBRequest<T> | IDBTransaction) {
        return new Promise<T>((resolve, reject) => {
            // @ts-ignore
            request.oncomplete = request.onsuccess = () => resolve(request.result);

            // @ts-ignore
            request.onabort = request.onerror = () => reject(request.error);
        });
    }
}

namespace IdbKeyval {
    /** */
    export interface IConstructorOptions {
        /**
         * Defines the name of the IndexedDB database as it is stored in the browser.
         * Note that the name is prefixed with the IdbKeyval database prefix constant.
         */
        name?: string | number;

        /**
         * Defines the name or names of the index or indexes to define on the database.
         */
        indexes?: string | string[];
    }

    /** */
    export interface IQuery {
        /**
         * A standard IDBKeyRange to use for the query. Worth noting that the  methods
         * in the static IdbKeyval.* namespace contain utility functions to ease the creation
         * of IDBKeyRange objects.
         */
        range?: IDBKeyRange;

        /** The name of the index to use for the query. */
        index?: string;

        /** A number which indicates the maximum number of objects to return from a query. */
        limit?: number;
    }

    /** */
    export type Key = string | number | Date | BufferSource;
}

import type { ResolveError, ResultObj, ResultPass, ResultsList } from "$root";

export type IClientDatastoreSetResolve = ResolveError<ResultPass>;
export type IClientDatastoreGetResolve = ResolveError<ResultObj<string>>;
export type IClientDatastoreSetPResolve = ResolveError<ResultPass>;
export type IClientDatastoreGetPResolve = ResolveError<ResultObj<string>>;
export type IClientDatastoreKeysResolve = ResolveError<ResultsList<string>>;
export type IClientDatastoreEntriesResolve = ResolveError<ResultsList<[string, unknown]>>;
export type IClientDatastoreRemoveResolve = ResolveError<ResultPass>;

export type IClientDatastore<
    TKeyMap extends Record<string, string>,
    TParamKeyMap extends Record<string, (...args: any[]) => string>
> = {
    init(): Promise<void>;
    set(key: keyof TKeyMap, value: string): Promise<IClientDatastoreSetResolve>;
    get(key: keyof TKeyMap): Promise<IClientDatastoreGetResolve>;
    setp<K extends keyof TParamKeyMap>(key: K, key_param: Parameters<TParamKeyMap[K]>[0], value: string): Promise<IClientDatastoreSetPResolve>;
    getp<K extends keyof TParamKeyMap>(key: K, key_param: Parameters<TParamKeyMap[K]>[0]): Promise<IClientDatastoreGetPResolve>;
    keys(): Promise<IClientDatastoreKeysResolve>;
    entries(): Promise<IClientDatastoreEntriesResolve>
    remove(key: string): Promise<IClientDatastoreRemoveResolve>;
};
import type { ResolveError, ResultObj, ResultPass, ResultsList } from "@radroots/utils";

export type IClientDatastoreValue = string | null;

export type IClientDatastoreSetResolve = ResolveError<ResultPass>;
export type IClientDatastoreGetResolve = ResolveError<ResultObj<string>>;
export type IClientDatastoreSetPResolve = ResolveError<ResultPass>;
export type IClientDatastoreGetPResolve = ResolveError<ResultObj<string>>;
export type IClientDatastoreKeysResolve = ResolveError<ResultsList<string>>;
export type IClientDatastoreDelResolve = ResolveError<ResultObj<string>>;
export type IClientDatastoreDelPrefResolve = ResolveError<ResultsList<string>>;
export type IClientDatastoreEntriesResolve = ResolveError<ResultsList<[string, IClientDatastoreValue]>>;

export type IClientDatastoreKeyMap = Record<string, string>;
export type IClientDatastoreKeyParamMap = Record<string, (...args: string[]) => string>;

export type IClientDatastore<
    TKeyMap extends IClientDatastoreKeyMap,
    TKeyParamMap extends IClientDatastoreKeyParamMap,
    TKeyObjMap extends IClientDatastoreKeyMap,
> = {
    init(): Promise<ResolveError<void>>;
    set(key: keyof TKeyMap, value: string): Promise<ResolveError<ResultPass>>;
    get(key: keyof TKeyMap): Promise<ResolveError<ResultObj<string>>>;
    set_obj(key: keyof TKeyObjMap, value: TKeyObjMap): Promise<ResolveError<ResultPass>>;
    update_obj(key: keyof TKeyObjMap, value: Partial<TKeyObjMap>): Promise<ResolveError<ResultPass>>;
    get_obj<T>(key: keyof TKeyObjMap): Promise<ResolveError<ResultObj<T>>>;
    del_obj(key: keyof TKeyObjMap): Promise<ResolveError<ResultObj<string>>>;
    del(key: keyof TKeyMap): Promise<IClientDatastoreDelResolve>;
    del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve>;
    setp<K extends keyof TKeyParamMap>(key: K, key_param: Parameters<TKeyParamMap[K]>[0], value: string): Promise<ResolveError<ResultPass>>;
    getp<K extends keyof TKeyParamMap>(key: K, key_param: Parameters<TKeyParamMap[K]>[0]): Promise<ResolveError<ResultObj<string>>>;
    keys(): Promise<ResolveError<ResultsList<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
};

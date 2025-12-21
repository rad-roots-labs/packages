import type { IdbClientConfig, ResolveError, ResultObj, ResultPass, ResultsList } from "@radroots/utils";
import type { BackupDatastorePayload } from "../backup/types.js";

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

export interface IClientDatastore<
    TKeyMap extends IClientDatastoreKeyMap,
    TKeyParamMap extends IClientDatastoreKeyParamMap,
    TKeyObjMap extends IClientDatastoreKeyMap,
> {
    init(): Promise<ResolveError<void>>;
    get_config(): IdbClientConfig;
    get_store_id(): string;
    set(key: keyof TKeyMap, value: string): Promise<ResolveError<ResultObj<string>>>;
    get(key: keyof TKeyMap): Promise<ResolveError<ResultObj<string>>>;
    set_obj<T>(key: keyof TKeyObjMap, value: T): Promise<ResolveError<ResultObj<T>>>;
    update_obj<T extends Record<string, unknown>>(key: keyof TKeyObjMap, value: Partial<T>): Promise<ResolveError<ResultObj<T>>>;
    get_obj<T>(key: keyof TKeyObjMap): Promise<ResolveError<ResultObj<T>>>;
    del_obj(key: keyof TKeyObjMap): Promise<ResolveError<ResultObj<string>>>;
    del(key: keyof TKeyMap): Promise<IClientDatastoreDelResolve>;
    del_pref(key_prefix: string): Promise<IClientDatastoreDelPrefResolve>;
    setp<K extends keyof TKeyParamMap>(key: K, key_param: Parameters<TKeyParamMap[K]>[0], value: string): Promise<ResolveError<ResultObj<string>>>;
    getp<K extends keyof TKeyParamMap>(key: K, key_param: Parameters<TKeyParamMap[K]>[0]): Promise<ResolveError<ResultObj<string>>>;
    keys(): Promise<ResolveError<ResultsList<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
    export_backup(): Promise<ResolveError<BackupDatastorePayload>>;
    import_backup(payload: BackupDatastorePayload): Promise<ResolveError<void>>;
}

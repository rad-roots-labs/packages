import type { ResolveError, ResultObj, ResultPass, ResultPublicKey, ResultSecretKey, ResultsList } from "@radroots/utils";
import type { BackupKeystorePayload } from "../backup/types.js";

export type IClientKeystoreValue = string | null;

export interface IClientKeystore {
    add(key: string, value: string): Promise<ResolveError<ResultObj<string>>>;
    remove(key: string): Promise<ResolveError<ResultObj<string>>>;
    read(key?: string | null): Promise<ResolveError<ResultObj<IClientKeystoreValue>>>;
    keys(): Promise<ResolveError<ResultsList<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
    get_store_id(): string;
    export_backup(): Promise<ResolveError<BackupKeystorePayload>>;
    import_backup(payload: BackupKeystorePayload): Promise<ResolveError<void>>;
}

export interface IClientKeystoreNostr {
    generate(): Promise<ResolveError<ResultPublicKey>>;
    add(secret_key: string): Promise<ResolveError<ResultPublicKey>>;
    read(public_key: string): Promise<ResolveError<ResultSecretKey>>;
    keys(): Promise<ResolveError<ResultsList<string>>>;
    remove(public_key: string): Promise<ResolveError<ResultObj<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
}

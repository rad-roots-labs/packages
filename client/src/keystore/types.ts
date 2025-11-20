import type { ResolveError, ResultObj, ResultPass, ResultPublicKey, ResultSecretKey, ResultsList } from "@radroots/utils";

export type IClientKeystoreValue = string | null;

export type IClientKeystore = {
    add(key: string, value: string): Promise<ResolveError<ResultObj<string>>>;
    remove(key: string): Promise<ResolveError<ResultObj<string>>>;
    read(key?: string | null): Promise<ResolveError<ResultObj<IClientKeystoreValue>>>;
    keys(key: string): Promise<ResolveError<ResultsList<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
};

export type IClientKeystoreNostr = {
    generate(): Promise<ResolveError<ResultPublicKey>>;
    add(secret_key: string): Promise<ResolveError<ResultPublicKey>>;
    read(public_key: string): Promise<ResolveError<ResultSecretKey>>;
    keys(): Promise<ResolveError<ResultsList<string>>>;
    remove(public_key: string): Promise<ResolveError<ResultObj<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
};
import type { ResolveError, ResultObj, ResultPass, ResultsList } from "@radroots/utils";

export type IClientKeystoreValue = string | null;

export type IClientKeystore = {
    add(key: string, value: string): Promise<ResolveError<ResultObj<string>>>;
    remove(key: string): Promise<ResolveError<ResultObj<string>>>;
    read(key?: string | null): Promise<ResolveError<ResultObj<IClientKeystoreValue>>>;
    keys(key: string): Promise<ResolveError<ResultsList<string>>>;
    reset(): Promise<ResolveError<ResultPass>>;
};
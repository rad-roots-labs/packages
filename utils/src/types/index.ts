import type { IError } from "@radroots/types-bindings";

export type ResolveStatus = "info" | "warning" | "error" | "success";

export type FileBytesFormat = `kb` | `mb` | `gb`;
export type FileMimeType = string;
export type FilePath = { file_path: string; file_name: string; mime_type: FileMimeType; }
export type FilePathBlob = { blob_path: string; blob_name: string; mime_type?: FileMimeType; }

export type WebFilePath = FilePath | FilePathBlob;

export type ValStr = string | undefined | null;

export type IdbClientConfig = {
    database: string;
    store: string;
};

export type ValidationRegex = {
    value: RegExp;
    charset: RegExp;
}

export type CallbackPromise = () => Promise<void>;
export type CallbackPromiseFigureResult<Ti, Tr> = (value: Ti) => Promise<Tr | undefined>;
export type CallbackPromiseFull<Ti, Tr> = (value: Ti) => Promise<Tr>;
export type CallbackPromiseGeneric<T> = (value: T) => Promise<void>;
export type CallbackPromiseReturn<T> = () => Promise<T>;
export type CallbackPromiseResult<Tr> = () => Promise<Tr | undefined>;

export type ResultId = { id: string; };
export type ResultPass = { pass: true; };
export type ResultBool = ResultObj<boolean>;
export type ResultsList<T> = { results: T[]; };
export type ResultObj<T> = { result: T; };
export type ResultPublicKey = { public_key: string; };
export type ResultSecretKey = { secret_key: string; };

export type ResolveError<T> = T | IError<string>;
export type ResolveErrorMsg<TRes, TMsg extends string> = TRes | IError<TMsg>;

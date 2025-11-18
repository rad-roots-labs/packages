import type { IError } from "@radroots/types-bindings";

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

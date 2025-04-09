import { ErrorMessage } from "$root";

export type FieldRecord = Record<string, string>;
export type NotifyMessage = {
    message: string;
    ok?: string;
    cancel?: string;
};

export type GeometryPoint = {
    type: string;
    coordinates: number[];
};

export type GeometryPolygon = {
    type: string;
    coordinates: number[][][];
};

export type GeolocationPointTuple = [number, number];

export type ResultId = { id: string; };
export type ResultPass = { pass: true; };
export type ResultsList<T> = { results: T[]; };
export type ResultObj<T> = { result: T; };
export type ResultPublicKey = { public_key: string; };
export type ResultSecretKey = { secret_key: string; };

export type ResolveError<T> = T | ErrorMessage<string>;
export type ResolveErrorMsg<TRes, TMsg extends string> = TRes | ErrorMessage<TMsg>;

export type FileBytesFormat = `kb` | `mb` | `gb`;
export type FileMimeType = string;
export type FilePath = { file_path: string; file_name: string; mime_type: FileMimeType; }

export type CallbackPromise = () => Promise<void>;
export type CallbackPromiseFigureResult<Ti, Tr> = (value: Ti) => Promise<Tr | undefined>;
export type CallbackPromiseFull<Ti, Tr> = (value: Ti) => Promise<Tr>;
export type CallbackPromiseGeneric<T> = (value: T) => Promise<void>;
export type CallbackPromiseReturn<T> = () => Promise<T>;
export type CallbackPromiseResult<Tr> = () => Promise<Tr | undefined>;
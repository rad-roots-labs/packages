import type { IError } from "@radroots/types-bindings";
import type { ResolveError } from "@radroots/utils";

export type FieldRecord = Record<string, string>;

export type NotifyMessage = {
    message: string;
    ok?: string;
    cancel?: string;
};

export type HttpMethod = "get" | "post" | "put";

export type HttpJsonPrimitive = string | number | boolean | null;
export type HttpJsonValue = HttpJsonPrimitive | { [key: string]: HttpJsonValue } | HttpJsonValue[];

export type IHttpOptsData = HttpJsonValue | FormData | Blob | ArrayBuffer | URLSearchParams;
export type IHttpOptsParams = Record<string, string | string[]>;

export type IHttpOpts = {
    url: string;
    method?: HttpMethod;
    params?: IHttpOptsParams;
    data?: IHttpOptsData;
    data_bin?: Uint8Array;
    authorization?: string;
    headers?: FieldRecord;
    connect_timeout?: number;
};

export type IHttpImageResponse = {
    status: number;
    blob?: Blob;
    headers: FieldRecord;
    url: string;
};

export type IHttpResponse = {
    status: number;
    data?: unknown;
    error?: string;
    message?: NotifyMessage;
    headers: FieldRecord;
    url: string;
};

export type HttpError = IError<string>;

export interface IClientHttp {
    fetch(opts: IHttpOpts): Promise<ResolveError<IHttpResponse>>;
    fetch_image(url: string): Promise<ResolveError<IHttpImageResponse>>;
}

export type WebHttpConfig = {
    app_name?: string;
    app_version?: string;
    app_hash?: string;
};

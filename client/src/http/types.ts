import type { ErrorMessage, FieldRecord } from "@radroots/utils";

export type IClientHttpOpts = {
    url: string;
    method?: `get` | `post` | `put`;
    params?: {
        [key: string]: string | string[];
    };
    data?: Record<string, string | number | boolean>;
    data_bin?: Uint8Array;
    authorization?: string;
    headers?: FieldRecord;
    connect_timeout?: number;
};

export type IClientHttpImageResponse = {
    status: number;
    blob?: Blob;
    headers: FieldRecord;
    url: string;
};

export type IClientHttpResponseError = {
    message: string;
    label_ok?: string;
    label_cancel?: string;
};

export type IClientHttpResponse = {
    status: number;
    data: any;
    error?: IClientHttpResponseError;
    headers: FieldRecord;
    url: string;
};

export type IClientHttp = {
    fetch(opts: IClientHttpOpts): Promise<IClientHttpResponse | ErrorMessage<string>>;
    fetch_image(url: string): Promise<IClientHttpImageResponse | ErrorMessage<string>>;
};
import type { IError } from "@radroots/types-bindings";
import { FieldRecord, NotifyMessage } from "../types/index.js";

export const is_err_response = (response: any): response is { err: string } => {
    return "err" in response && typeof response.err === "string";
}

export const is_pass_response = (response: any): response is { pass: true } => {
    return "pass" in response && response.pass === true;
}

export const is_result_response = (response: any): response is { result: string } => {
    return "result" in response && typeof response.result === "string";
}

export const is_results_response = (response: any): response is { results: string[] } => {
    return "results" in response && Array.isArray(response.results);
}

export const is_error_response = (response: any): response is { error: string } => {
    return "error" in response && response.error;
}

export const is_message_response = (response: any): response is NotifyMessage => {
    return (
        typeof response === "object" &&
        response !== null &&
        "message" in response &&
        typeof response.message === "string" &&
        (response.ok === undefined || typeof response.ok === "string") &&
        (response.cancel === undefined || typeof response.cancel === "string")
    );
};
export type IClientHttp = {
    fetch(opts: IHttpOpts): Promise<IHttpResponse | IError<string>>;
};

export type IHttpImageResponse = {
    status: number;
    blob?: Blob;
    headers: FieldRecord;
    url: string;
};

export type IHttpResponse = {
    status: number;
    data?: any;
    error?: string;
    message?: NotifyMessage;
    headers: FieldRecord;
    url: string;
};

export type IHttpOptsData = any;
export type IHttpOptsParams = Record<string, string | string[]>;

export type IHttpOpts = {
    url: string;
    method?: `get` | `post` | `put`;
    params?: IHttpOptsParams;
    data?: IHttpOptsData;
    data_bin?: Uint8Array;
    authorization?: string;
    headers?: FieldRecord;
    connect_timeout?: number;
};

export const lib_http_to_bodyinit = (data: any): RequestInit["body"] => {
    if (typeof data === 'string') return data;
    else if (data instanceof FormData) return data;
    else if (data instanceof Blob) return data;
    else if (data instanceof ArrayBuffer) return data;
    else if (data instanceof URLSearchParams) return data;
    return JSON.stringify(data);
}

export const lib_http_parse_headers = (headers: Headers): FieldRecord => {
    const acc: FieldRecord = {};
    headers.forEach((value, key) => acc[key] = value);
    return acc;
};

export const http_fetch_opts = (opts: IHttpOpts): { url: string; options: RequestInit; } => {
    const { url } = opts;
    const method = opts.method ? opts.method.toUpperCase() : `GET`;
    const headers = new Headers();
    if (method === `POST`) headers.append(`Content-Type`, `application/json`);
    if (opts.authorization) headers.append(`Authorization`, `Bearer ${encodeURIComponent(opts.authorization)}`);
    if (opts.headers) Object.entries(opts.headers).forEach(([k, v]) => headers.append(k, v))
    const options: RequestInit = {
        method,
        headers,
    }
    if (opts.data) options.body = lib_http_to_bodyinit(opts.data);
    if (opts.data_bin) options.body = opts.data_bin as any;
    return {
        url,
        options
    }
};

export const lib_http_parse_response = async (res: Response): Promise<IHttpResponse> => {
    let data: unknown = null;
    try {
        const res_json = await res.clone().json();
        data = typeof res_json === `string` ? JSON.parse(res_json) : res_json;
    } catch { }
    if (!data) {
        try {
            data = await res.text();
        } catch { }
    }
    return {
        status: res.status,
        url: res.url,
        data: res.ok && data ? data : null,
        error: !res.ok && is_error_response(data) ? data.error : undefined,
        message: res.ok && is_message_response(data) ? data : undefined,
        headers: lib_http_parse_headers(res.headers)
    };
};

export const http_fetch = async (opts: IHttpOpts): Promise<IHttpResponse> => {
    const { url, options } = http_fetch_opts(opts);
    const response = await fetch(url, options);
    let data: any = null;
    try {
        const res_json = await response.json();
        data = typeof res_json === `string` ? JSON.parse(res_json) : res_json;
    } catch { }
    if (!data) {
        try {
            const res_text = await response.text();
            data = res_text;
        } catch { }
    }
    return {
        status: response.status,
        url: response.url,
        data,
        headers: lib_http_parse_headers(response.headers)
    };
};

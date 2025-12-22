import type { FieldRecord, IHttpOpts, IHttpOptsData, IHttpResponse, NotifyMessage } from "./types.js";

const is_record = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

export const is_err_response = (response: unknown): response is { err: string } => {
    if (!is_record(response)) return false;
    const err = response["err"];
    return typeof err === "string";
};

export const is_pass_response = (response: unknown): response is { pass: true } => {
    if (!is_record(response)) return false;
    return response["pass"] === true;
};

export const is_result_response = (response: unknown): response is { result: string } => {
    if (!is_record(response)) return false;
    const result = response["result"];
    return typeof result === "string";
};

export const is_results_response = (response: unknown): response is { results: string[] } => {
    if (!is_record(response)) return false;
    const results = response["results"];
    return Array.isArray(results) && results.every((value) => typeof value === "string");
};

export const is_error_response = (response: unknown): response is { error: string } => {
    if (!is_record(response)) return false;
    const error = response["error"];
    return typeof error === "string";
};

export const is_message_response = (response: unknown): response is NotifyMessage => {
    if (!is_record(response)) return false;
    const message = response["message"];
    const ok = response["ok"];
    const cancel = response["cancel"];
    return (
        typeof message === "string" &&
        (ok === undefined || typeof ok === "string") &&
        (cancel === undefined || typeof cancel === "string")
    );
};

export const lib_http_to_bodyinit = (data: IHttpOptsData): RequestInit["body"] => {
    if (typeof data === "string") return data;
    if (data instanceof FormData) return data;
    if (data instanceof Blob) return data;
    if (data instanceof ArrayBuffer) return data;
    if (data instanceof URLSearchParams) return data;
    return JSON.stringify(data);
};

export const lib_http_parse_headers = (headers: Headers): FieldRecord => {
    const acc: FieldRecord = {};
    headers.forEach((value, key) => acc[key] = value);
    return acc;
};

export const http_fetch_opts = (opts: IHttpOpts): { url: string; options: RequestInit; } => {
    const { url } = opts;
    const method = opts.method ? opts.method.toUpperCase() : "GET";
    const headers = new Headers();
    if (method === "POST") headers.append("Content-Type", "application/json");
    if (opts.authorization) headers.append("Authorization", `Bearer ${encodeURIComponent(opts.authorization)}`);
    if (opts.headers) Object.entries(opts.headers).forEach(([key, value]) => headers.append(key, value));
    const options: RequestInit = {
        method,
        headers,
    };
    if (opts.data) options.body = lib_http_to_bodyinit(opts.data);
    if (opts.data_bin) options.body = opts.data_bin;
    return {
        url,
        options
    };
};

export const lib_http_parse_response = async (res: Response): Promise<IHttpResponse> => {
    let data: unknown = null;
    try {
        const res_json: unknown = await res.clone().json();
        if (typeof res_json === "string") {
            try {
                const parsed: unknown = JSON.parse(res_json);
                data = parsed;
            } catch {
                data = res_json;
            }
        } else {
            data = res_json;
        }
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
    let data: unknown = null;
    try {
        const res_json: unknown = await response.json();
        if (typeof res_json === "string") {
            try {
                const parsed: unknown = JSON.parse(res_json);
                data = parsed;
            } catch {
                data = res_json;
            }
        } else {
            data = res_json;
        }
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

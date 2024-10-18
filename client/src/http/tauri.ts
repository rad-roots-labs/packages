import { err_msg, type ErrorMessage } from '@radroots/utils';
import { type ClientOptions, fetch } from '@tauri-apps/plugin-http';
import type { IClientHttp, IClientHttpOpts, IClientHttpResponse } from './types';

const parse_headers = (headers: Headers): Record<string, string> => {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => record[key] = value);
    return record;
};

const to_bodyinit = (data: any): BodyInit => {
    if (typeof data === 'string') {
        return data;
    } else if (data instanceof FormData) {
        return data;
    } else if (data instanceof Blob) {
        return data;
    } else if (data instanceof ArrayBuffer) {
        return data;
    } else if (data instanceof URLSearchParams) {
        return data;
    } else {
        return JSON.stringify(data);
    }
}
export class TauriClientHttp implements IClientHttp {
    public async fetch(opts: IClientHttpOpts): Promise<IClientHttpResponse | ErrorMessage<string>> {
        try {
            const { url } = opts;
            const options: RequestInit & ClientOptions = {
                method: opts.method ? opts.method.toUpperCase() : `GET`,
            }
            if (opts.data) options.body = to_bodyinit(opts.data);
            if (opts.headers) options.headers = opts.headers;
            if (opts.connect_timeout) options.connectTimeout = opts.connect_timeout;
            const response = await fetch(url, options);
            switch (response.ok) {
                case true: {
                    const response_json = await response.json();
                    return {
                        status: response.status,
                        url: response.url,
                        data: typeof response_json === `string` ? JSON.parse(response_json) : response_json,
                        headers: parse_headers(response.headers)
                    };
                }
                case false: {
                    return {
                        status: response.status,
                        url: response.url,
                        data: null,
                        headers: parse_headers(response.headers)
                    };
                }
            }
        } catch (e) {
            console.log(`e fetch`, e)
            return err_msg(String(e));
        };
    }
}
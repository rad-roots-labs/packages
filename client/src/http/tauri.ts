import { err_msg, type ErrorMessage, type FieldRecord } from '@radroots/utils';
import { type ClientOptions, fetch } from '@tauri-apps/plugin-http';
import type { IClientDeviceMetadata } from '../device/types';
import type { IClientHttp, IClientHttpOpts, IClientHttpResponse } from './types';

const parse_headers = (headers: Headers): FieldRecord => {
    const acc: FieldRecord = {};
    headers.forEach((value, key) => acc[key] = value);
    return acc;
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
    private _headers: FieldRecord;

    constructor() {
        this._headers = {};
    }

    public async init(opts: IClientDeviceMetadata): Promise<void> {
        this._headers = {
            "X-Client-Version": opts.version,
            "X-Client-Platform": opts.platform,
            "X-Client-Locale": opts.locale
        };
    }

    public async fetch(opts: IClientHttpOpts): Promise<IClientHttpResponse | ErrorMessage<string>> {
        try {
            const { url } = opts;
            const headers: FieldRecord = {
                ...this._headers,
                ...opts.headers,
            };
            if (opts.authorization) headers['Authorization'] = `Bearer ${encodeURIComponent(opts.authorization)}`;
            const options: RequestInit & ClientOptions = {
                method: opts.method ? opts.method.toUpperCase() : `GET`,
                headers,
            }
            if (opts.data) options.body = to_bodyinit(opts.data);
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
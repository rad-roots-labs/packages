import { err_msg, http_fetch_opts, lib_http_parse_headers, lib_http_parse_response, type ErrorMessage, type FieldRecord, type IHttpImageResponse, type IHttpOpts, type IHttpResponse } from '@radroots/util';
import { fetch, type ClientOptions } from '@tauri-apps/plugin-http';
import type { IClientHttp } from './types';

export class TauriClientHttp implements IClientHttp {
    private _headers: FieldRecord;

    constructor() {
        this._headers = {
            "Content-Type": 'application/json',
            "User-Agent": `radroots/1.0.0`,
            "X-Radroots-Version": `radroots/*`,
        };
    }

    public async init(opts?: {
        app_version?: string;
        app_hash?: string;
    }): Promise<void> {
        if (opts?.app_version) this._headers["User-Agent"] = `radroots/${opts.app_version}`;
        if (opts?.app_hash) this._headers["X-Radroots-Version"] = `radroots/${opts.app_hash}`;
    }

    public async fetch(opts: IHttpOpts): Promise<IHttpResponse | ErrorMessage<string>> {
        try {
            const { url, options } = http_fetch_opts(opts);
            const response = await fetch(url, options);
            console.log(`response `, response)
            return lib_http_parse_response(response);
        } catch (e) {
            console.log(`e fetch`, e)
            return err_msg(String(e));
        };
    }

    public async fetch_image(url: string): Promise<IHttpImageResponse | ErrorMessage<string>> {
        try {
            const headers: FieldRecord = {
                ...this._headers,
            };
            const options: RequestInit & ClientOptions = {
                method: `GET`,
                headers,
            }
            const response = await fetch(url, options);
            switch (response.ok) {
                case true: {
                    const blob = await response.blob();

                    return {
                        status: response.status,
                        url: response.url,
                        blob,
                        headers: lib_http_parse_headers(response.headers)
                    };
                }
                case false: {
                    return {
                        status: response.status,
                        url: response.url,
                        headers: lib_http_parse_headers(response.headers)
                    };
                }
            }
        } catch (e) {
            console.log(`e fetch_image`, e)
            return err_msg(String(e));
        };
    }
}
import {
    err_msg,
    handle_err,
    type ResolveError
} from "@radroots/utils";
import { cl_http_error } from "./error.js";
import {
    http_fetch_opts,
    lib_http_parse_headers,
    lib_http_parse_response
} from "./helpers.js";
import type { IClientHttp, IHttpImageResponse, IHttpOpts, IHttpResponse, WebHttpConfig } from "./types.js";

export interface IWebHttp extends IClientHttp { }

export class WebHttp implements IWebHttp {
    private _headers: Headers;

    constructor(http_config?: WebHttpConfig) {
        try {
            const headers = new Headers({
                "Accept": "application/json",
                "Content-Type": "application/json"
            });
            if (http_config?.app_name) headers.set("X-Radroots-Client", http_config.app_name);
            if (http_config?.app_version) headers.set("X-Radroots-App-Version", http_config.app_version);
            if (http_config?.app_hash) headers.set("X-Radroots-App-Commit", http_config.app_hash);
            this._headers = headers;
        } catch {
            throw new Error(cl_http_error.init_failure);
        }
    }

    private apply_default_headers(headers: Headers): void {
        this._headers.forEach((value, key) => {
            if (!headers.has(key)) headers.set(key, value);
        });
    }

    public async fetch(opts: IHttpOpts): Promise<ResolveError<IHttpResponse>> {
        try {
            const { url, options } = http_fetch_opts(opts);
            if (options.headers instanceof Headers) this.apply_default_headers(options.headers);
            const response = await fetch(url, options);
            return lib_http_parse_response(response);
        } catch (e) {
            handle_err(e);
            return err_msg(cl_http_error.fetch_failure);
        };
    }

    public async fetch_image(url: string): Promise<ResolveError<IHttpImageResponse>> {
        try {
            const headers = new Headers(this._headers);
            const response = await fetch(url, {
                method: "GET",
                headers,
            });
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
            handle_err(e);
            return err_msg(cl_http_error.fetch_image_failure);
        };
    }
}

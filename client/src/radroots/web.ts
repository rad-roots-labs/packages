import { err_msg, type IHttpResponse, is_err_response, is_error_response, schema_media_resource } from '@radroots/utils';
import { lib_nostr_event_sign_attest } from '@radroots/utils-nostr';
import { WebHttp } from '../http/web.js';
import type { IClientRadroots, IClientRadrootsAccountsActivate, IClientRadrootsAccountsActivateResolve, IClientRadrootsAccountsCreate, IClientRadrootsAccountsCreateResolve, IClientRadrootsAccountsRequest, IClientRadrootsAccountsRequestResolve, IClientRadrootsMediaImageUpload, IClientRadrootsMediaImageUploadResolve } from "./types.js";

export class WebClientRadroots implements IClientRadroots {
    private _base_url: string
    private _http_client: WebHttp

    constructor(base_url: string) {
        if (!base_url) throw new Error(`Missing base_url`);
        const parsed_url = new URL(base_url);
        const sanitized_base_url = `${parsed_url.origin}${parsed_url.pathname}`.replace(/\/+$/, ``);
        this._base_url = sanitized_base_url;
        this._http_client = new WebHttp();
    }

    private is_res_pass(res: IHttpResponse): boolean {
        return res.data && res.data.pass === true;
    }

    private parse_res_field(field: unknown): string | undefined {
        if (typeof field === `string` && field) return field;
    }

    private create_x_nostr_event(secret_key: string): string {
        return JSON.stringify(lib_nostr_event_sign_attest(secret_key));
    }

    public accounts_request = async (opts: IClientRadrootsAccountsRequest): Promise<IClientRadrootsAccountsRequestResolve> => {
        const { profile_name, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/request`,
            method: `post`,
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            data: { profile_name }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const tok = this.parse_res_field(res.data.tok);
            if (tok) return { result: tok };
        }
        return err_msg(`error.radroots.account_registered`);
    }

    public accounts_create = async (opts: IClientRadrootsAccountsCreate): Promise<IClientRadrootsAccountsCreateResolve> => {
        const { tok, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/create`,
            method: `post`,
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            authorization: tok
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const id = this.parse_res_field(res.data.id);
            if (id) return { result: id };
        }
        return err_msg(`error.client.request_failure`);
    }

    public accounts_activate = async (opts: IClientRadrootsAccountsActivate): Promise<IClientRadrootsAccountsActivateResolve> => {
        const { id, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/activate`,
            method: `post`,
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            data: { id }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) return { pass: true };
        return err_msg(`error.client.request_failure`);
    }

    public media_image_upload = async (opts: IClientRadrootsMediaImageUpload): Promise<IClientRadrootsMediaImageUploadResolve> => {
        const { mime_type, file_data, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/media/image/upload`,
            method: `put`,
            headers: {
                "Content-Type": mime_type || "image/png",
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            data_bin: file_data
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const res_data = schema_media_resource.safeParse(res.data);
            console.log(`res_data `, res_data)
            if (res_data.success && res_data.data) return res_data.data;
        }
        return err_msg(`error.client.request_failure`);
    }
}

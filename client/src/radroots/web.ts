import { err_msg, schema_media_resource } from '@radroots/utils';
import { type IHttpResponse, is_err_response, is_error_response, is_pass_response, WebHttp } from '@radroots/http';
import { nostr_event_sign_attest } from "@radroots/nostr";
import { cl_radroots_error } from "./error.js";
import type {
    IClientRadroots,
    IClientRadrootsAccountsActivate,
    IClientRadrootsAccountsActivateResolve,
    IClientRadrootsAccountsCreate,
    IClientRadrootsAccountsCreateResolve,
    IClientRadrootsAccountsRequest,
    IClientRadrootsAccountsRequestResolve,
    IClientRadrootsMediaImageUpload,
    IClientRadrootsMediaImageUploadResolve
} from "./types.js";

export interface IWebClientRadroots extends IClientRadroots { }

export class WebClientRadroots implements IWebClientRadroots {
    private _base_url: string
    private _http_client: WebHttp

    constructor(base_url: string) {
        if (!base_url) throw new Error(cl_radroots_error.missing_base_url);
        const parsed_url = new URL(base_url);
        const sanitized_base_url = `${parsed_url.origin}${parsed_url.pathname}`.replace(/\/+$/, ``);
        this._base_url = sanitized_base_url;
        this._http_client = new WebHttp();
    }

    private is_res_pass(res: IHttpResponse): boolean {
        return is_pass_response(res.data);
    }

    private parse_res_field(field: unknown): string | undefined {
        if (typeof field === `string` && field) return field;
    }

    private is_record(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null;
    }

    private create_x_nostr_event(secret_key: string): string {
        return JSON.stringify(nostr_event_sign_attest(secret_key));
    }

    public async accounts_request(opts: IClientRadrootsAccountsRequest): Promise<IClientRadrootsAccountsRequestResolve> {
        const { profile_name, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/request`,
            method: "post",
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            data: { profile_name }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const res_data = this.is_record(res.data) ? res.data : null;
            const tok = res_data ? this.parse_res_field(res_data["tok"]) : undefined;
            if (tok) return { result: tok };
        }
        return err_msg(cl_radroots_error.account_registered);
    }

    public async accounts_create(opts: IClientRadrootsAccountsCreate): Promise<IClientRadrootsAccountsCreateResolve> {
        const { tok, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/create`,
            method: "post",
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            authorization: tok
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const res_data = this.is_record(res.data) ? res.data : null;
            const id = res_data ? this.parse_res_field(res_data["id"]) : undefined;
            if (id) return { result: id };
        }
        return err_msg(cl_radroots_error.request_failure);
    }

    public async accounts_activate(opts: IClientRadrootsAccountsActivate): Promise<IClientRadrootsAccountsActivateResolve> {
        const { id, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/accounts/activate`,
            method: "post",
            headers: {
                "X-Nostr-Event": this.create_x_nostr_event(secret_key),
            },
            data: { id }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) return err_msg(res.error);
        else if (this.is_res_pass(res)) return { result: id };
        return err_msg(cl_radroots_error.request_failure);
    }

    public async media_image_upload(opts: IClientRadrootsMediaImageUpload): Promise<IClientRadrootsMediaImageUploadResolve> {
        const { mime_type, file_data, secret_key } = opts
        const res = await this._http_client.fetch({
            url: `${this._base_url}/v1/media/image/upload`,
            method: "put",
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
            if (res_data.success && res_data.data) return res_data.data;
        }
        return err_msg(cl_radroots_error.request_failure);
    }
}

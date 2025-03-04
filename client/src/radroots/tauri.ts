
import { err_msg, type IHttpResponse, is_err_response, is_error_response } from '@radroots/util';
import { lib_http } from '../lib';
import type { IClientRadroots, IClientRadrootsFetchMediaImageUpload, IClientRadrootsFetchMediaImageUploadResolve, IClientRadrootsFetchProfileActivate, IClientRadrootsFetchProfileActivateResolve, IClientRadrootsFetchProfileCreate, IClientRadrootsFetchProfileCreateResolve, IClientRadrootsFetchProfileRequest, IClientRadrootsFetchProfileRequestResolve } from './types';
import { lib_nostr_event_sign_attest } from '@radroots/nostr-util';

export class TauriClientRadroots implements IClientRadroots {
    private _base_url: string;

    constructor(base_url: string) {
        this._base_url = base_url.replaceAll(`/`, ``);
    }

    private is_res_pass(res: IHttpResponse): boolean {
        return res.data && res.data.pass === true;
    }

    private parse_res_field(field: any): string | undefined {
        if (typeof field === `string` && field) return field;
    }

    public fetch_profile_request = async (opts: IClientRadrootsFetchProfileRequest): Promise<IClientRadrootsFetchProfileRequestResolve> => {
        const { profile_name, secret_key } = opts;
        const res = await lib_http.fetch({
            url: `${this._base_url}/public/profile/request`,
            method: `post`,
            headers: {
                "X-Nostr-Event": JSON.stringify(lib_nostr_event_sign_attest(secret_key)),
            },
            data: {
                profile_name
            }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const tok = this.parse_res_field(res.data.tok);
            if (tok) return { result: res.data.tok };
        }
        return err_msg(`error.radroots.profile_registered`);
    }

    public fetch_profile_create = async (opts: IClientRadrootsFetchProfileCreate): Promise<IClientRadrootsFetchProfileCreateResolve> => {
        const { tok, secret_key } = opts;
        const res = await lib_http.fetch({
            url: `${this._base_url}/public/profile/create`,
            method: `post`,
            headers: {
                "X-Nostr-Event": JSON.stringify(lib_nostr_event_sign_attest(secret_key)),
            },
            authorization: tok,
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) err_msg(res.error);
        else if (this.is_res_pass(res)) {
            const id = this.parse_res_field(res.data.id);
            if (id) return { result: id };
        }
        return err_msg(`error.client.request_failure`);
    }

    public fetch_profile_activate = async (opts: IClientRadrootsFetchProfileActivate): Promise<IClientRadrootsFetchProfileActivateResolve> => {
        const { id, secret_key } = opts;
        const res = await lib_http.fetch({
            url: `${this._base_url}/public/profile/activate`,
            method: `post`,
            headers: {
                "X-Nostr-Event": JSON.stringify(lib_nostr_event_sign_attest(secret_key)),
            },
            data: {
                id
            }
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) err_msg(res.error);
        else if (this.is_res_pass(res)) return { pass: true };
        return err_msg(`error.client.request_failure`);
    }

    public fetch_media_image_upload = async (opts: IClientRadrootsFetchMediaImageUpload): Promise<IClientRadrootsFetchMediaImageUploadResolve> => {
        const { file_path, file_data, secret_key } = opts;
        const res = await lib_http.fetch({
            url: `${this._base_url}/public/media/image/upload`,
            method: `put`,
            headers: {
                "Content-Type": file_path.mime_type,
                "X-Nostr-Event": JSON.stringify(lib_nostr_event_sign_attest(secret_key)),
            },
            data_bin: file_data,
        });
        if (is_err_response(res)) return res;
        if (is_error_response(res)) err_msg(res.error);
        else if (
            this.is_res_pass(res) &&
            `res_base` in res.data &&
            typeof res.data.res_base === `string` &&
            `res_path` in res.data &&
            typeof res.data.res_path === `string`) return {
                res_base: res.data.res_base,
                res_path: res.data.res_path,
            };
        return err_msg(`error.client.request_failure`);
    }
}


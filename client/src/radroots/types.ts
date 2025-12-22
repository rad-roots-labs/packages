import { MediaResource, ResolveErrorMsg, type ResultObj } from '@radroots/utils';

export type IClientRadrootsAccountsRequestMessage =
    | string
    | `error.client.request_failure`
    | `*-registered`;

export type IClientRadrootsAccountsRequest = { profile_name: string; secret_key: string; };
export type IClientRadrootsAccountsRequestResolve = ResolveErrorMsg<ResultObj<string>, IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsAccountsCreate = { tok: string; secret_key: string; };
export type IClientRadrootsAccountsCreateResolve = ResolveErrorMsg<ResultObj<string>, IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsAccountsActivate = { id: string; secret_key: string; };
export type IClientRadrootsAccountsActivateResolve = ResolveErrorMsg<ResultObj<string>, IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsMediaImageUpload = { mime_type?: string; file_data: Uint8Array; secret_key: string; };
export type IClientRadrootsMediaImageUploadResolve = ResolveErrorMsg<MediaResource, IClientRadrootsAccountsRequestMessage>;

export interface IClientRadroots {
    accounts_request(opts: IClientRadrootsAccountsRequest): Promise<IClientRadrootsAccountsRequestResolve>;
    accounts_create(opts: IClientRadrootsAccountsCreate): Promise<IClientRadrootsAccountsCreateResolve>;
    accounts_activate(opts: IClientRadrootsAccountsActivate): Promise<IClientRadrootsAccountsActivateResolve>;
    media_image_upload(opts: IClientRadrootsMediaImageUpload): Promise<IClientRadrootsMediaImageUploadResolve>;
}

import type { IError } from "@radroots/types-bindings";
import { type FilePath, type ResultObj, type ResultPass } from '@radroots/utils';

export type IClientRadrootsAccountsRequestMessage =
    | string
    | `error.client.request_failure`
    | `*-registered`;

export type IClientRadrootsAccountsRequest = { profile_name: string; secret_key: string; };
export type IClientRadrootsAccountsRequestResolve = ResultObj<string> | IError<IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsAccountsCreate = { tok: string; secret_key: string; };
export type IClientRadrootsAccountsCreateResolve = ResultObj<string> | IError<IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsAccountsActivate = { id: string; secret_key: string; };
export type IClientRadrootsAccountsActivateResolve = ResultPass | IError<IClientRadrootsAccountsRequestMessage>;
export type IClientRadrootsMediaImageUpload = { file_path: FilePath; file_data: Uint8Array; secret_key: string; };
export type IClientRadrootsMediaImageUploadResolve = any;

export type IClientRadroots = {
    accounts_request: (opts: IClientRadrootsAccountsRequest) => Promise<IClientRadrootsAccountsRequestResolve>;
    accounts_create: (opts: IClientRadrootsAccountsCreate) => Promise<IClientRadrootsAccountsCreateResolve>;
    accounts_activate: (opts: IClientRadrootsAccountsActivate) => Promise<IClientRadrootsAccountsActivateResolve>;
    media_image_upload: (opts: IClientRadrootsMediaImageUpload) => Promise<IClientRadrootsMediaImageUploadResolve>;
};

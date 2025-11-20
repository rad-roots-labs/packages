import type { IError } from "@radroots/types-bindings";
import { type FilePath, type ResultObj, type ResultPass } from '@radroots/utils';

export type IClientRadrootsProfileRequestMessage =
    | string
    | `error.client.request_failure`
    | `*-registered`;

export type IClientRadrootsProfileRequest = { profile_name: string; secret_key: string; };
export type IClientRadrootsProfileRequestResolve = ResultObj<string> | IError<IClientRadrootsProfileRequestMessage>;
export type IClientRadrootsProfileCreate = { tok: string; secret_key: string; };
export type IClientRadrootsProfileCreateResolve = ResultObj<string> | IError<IClientRadrootsProfileRequestMessage>;
export type IClientRadrootsProfileActivate = { id: string; secret_key: string; };
export type IClientRadrootsProfileActivateResolve = ResultPass | IError<IClientRadrootsProfileRequestMessage>;
export type IClientRadrootsMediaImageUpload = { file_path: FilePath; file_data: Uint8Array; secret_key: string; };
export type IClientRadrootsMediaImageUploadResolve = any;

export type IClientRadroots = {
    profile_request: (opts: IClientRadrootsProfileRequest) => Promise<IClientRadrootsProfileRequestResolve>;
    profile_create: (opts: IClientRadrootsProfileCreate) => Promise<IClientRadrootsProfileCreateResolve>;
    profile_activate: (opts: IClientRadrootsProfileActivate) => Promise<IClientRadrootsProfileActivateResolve>;
    media_image_upload: (opts: IClientRadrootsMediaImageUpload) => Promise<IClientRadrootsMediaImageUploadResolve>;
};

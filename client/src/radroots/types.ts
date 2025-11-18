import type { IError } from "@radroots/types-bindings";
import { type FilePath, type ResultObj, type ResultPass } from '@radroots/utils';

export type IClientRadrootsFetchProfileRequestMessage =
    | string
    | `error.client.request_failure`
    | `*-registered`;

export type IClientRadrootsFetchProfileRequest = { profile_name: string; secret_key: string; };
export type IClientRadrootsFetchProfileRequestResolve = ResultObj<string> | IError<IClientRadrootsFetchProfileRequestMessage>;
export type IClientRadrootsFetchProfileCreate = { tok: string; secret_key: string; };
export type IClientRadrootsFetchProfileCreateResolve = ResultObj<string> | IError<IClientRadrootsFetchProfileRequestMessage>;
export type IClientRadrootsFetchProfileActivate = { id: string; secret_key: string; };
export type IClientRadrootsFetchProfileActivateResolve = ResultPass | IError<IClientRadrootsFetchProfileRequestMessage>;
export type IClientRadrootsFetchMediaImageUpload = { file_path: FilePath; file_data: Uint8Array; secret_key: string; };
export type IClientRadrootsFetchMediaImageUploadResolve = any;

export type IClientRadroots = {
    fetch_profile_request: (opts: IClientRadrootsFetchProfileRequest) => Promise<IClientRadrootsFetchProfileRequestResolve>;
    fetch_profile_create: (opts: IClientRadrootsFetchProfileCreate) => Promise<IClientRadrootsFetchProfileCreateResolve>;
    fetch_profile_activate: (opts: IClientRadrootsFetchProfileActivate) => Promise<IClientRadrootsFetchProfileActivateResolve>;
    fetch_media_image_upload: (opts: IClientRadrootsFetchMediaImageUpload) => Promise<IClientRadrootsFetchMediaImageUploadResolve>;
};

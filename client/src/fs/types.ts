import { type ResolveError } from "@radroots/utils";

export type IClientFsOpenResult = { path: string }

export type IClientFsFileInfo = {
    size: number
    isFile: boolean
    isDirectory: boolean
    accessedAt?: number
    modifiedAt?: number
    createdAt?: number
};


export type IClientFsReadBinResolve = ResolveError<Uint8Array>

export type IClientFs = {
    exists(path: string): Promise<ResolveError<boolean>>;
    open(path: string): Promise<ResolveError<IClientFsOpenResult>>;
    info(path: string): Promise<ResolveError<IClientFsFileInfo>>;
    read_bin(path: string): Promise<IClientFsReadBinResolve>;
};

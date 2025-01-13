import type { FileHandle, FileInfo } from "@tauri-apps/plugin-fs";

export type IClientFsOpenResult = FileHandle;

export type IClientFsFileInfo = FileInfo;

export type IClientFsExistsResolve = boolean;
export type IClientFsOpenResolve = IClientFsOpenResult;
export type IClientFsReadBinResolve = Uint8Array;
export type IClientFsInfoResolve = IClientFsFileInfo;

export type IClientFs = {
    exists(path: string): Promise<IClientFsExistsResolve>;
    open(path: string): Promise<IClientFsOpenResolve>;
    read_bin(path: string): Promise<IClientFsReadBinResolve>;
    info(path: string): Promise<IClientFsInfoResolve>;
};
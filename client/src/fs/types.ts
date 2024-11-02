import type { FileHandle, FileInfo } from "@tauri-apps/plugin-fs";

export type IClientFsOpenResult = FileHandle;

export type IClientFsFileInfo = FileInfo;

export type IClientFs = {
    exists(path: string): Promise<boolean>;
    open(path: string): Promise<IClientFsOpenResult | undefined>;
    read_bin(path: string): Promise<Uint8Array | undefined>;
    info(path: string): Promise<IClientFsFileInfo | undefined>;
};
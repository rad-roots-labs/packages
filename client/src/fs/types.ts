import type { FileHandle } from "@tauri-apps/plugin-fs";

export type IClientFsOpenResult = FileHandle;

export type IClientFs = {
    exists(path: string): Promise<boolean>;
    open(path: string): Promise<IClientFsOpenResult | undefined>;
    read_bin(path: string): Promise<Uint8Array | undefined>;
};
import { BaseDirectory, exists, open, readFile, stat } from '@tauri-apps/plugin-fs';
import type { IClientFs, IClientFsExistsResolve, IClientFsInfoResolve, IClientFsOpenResolve, IClientFsReadBinResolve } from "./types";

export class TauriClientFs implements IClientFs {
    public async exists(path: string): Promise<IClientFsExistsResolve> {
        const res = await exists(path, { baseDir: BaseDirectory.AppData });
        return res;
    }

    public async open(path: string): Promise<IClientFsOpenResolve> {
        const res = await open(path, { read: true, baseDir: BaseDirectory.AppData });
        return res;
    }

    public async read_bin(path: string): Promise<IClientFsReadBinResolve> {
        const res = await readFile(path, { baseDir: BaseDirectory.AppData });
        return res;
    }

    public async info(path: string): Promise<IClientFsInfoResolve> {
        const res = await stat(path, { baseDir: BaseDirectory.AppData });
        return res;
    }
}

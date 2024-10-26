import { BaseDirectory, exists, open, readFile } from '@tauri-apps/plugin-fs';
import type { IClientFs, IClientFsOpenResult } from "./types";

export class TauriClientFs implements IClientFs {
    public async exists(path: string): Promise<boolean> {
        try {
            const res = await exists(path, { baseDir: BaseDirectory.AppData });
            return res;
        } catch (e) {
            console.log(`e exists`, e)
            return false;
        };
    }

    public async open(path: string): Promise<IClientFsOpenResult | undefined> {
        try {
            const res = await open(path, { read: true, baseDir: BaseDirectory.AppData });
            return res;
        } catch (e) {
            console.log(`e open`, e)
            return undefined;
        };
    }

    public async read_bin(path: string): Promise<Uint8Array | undefined> {
        try {
            const res = await readFile(path, { baseDir: BaseDirectory.AppData });
            return res;
        } catch (e) {
            console.log(`e read_bin`, e)
            return undefined;
        };
    }
}

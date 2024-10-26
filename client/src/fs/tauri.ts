import { BaseDirectory, exists as fs_exists, open as fs_open } from '@tauri-apps/plugin-fs';
import type { IClientFs, IClientFsOpenResult } from "./types";

export class TauriClientFs implements IClientFs {
    public async exists(path: string): Promise<boolean> {
        try {
            const res = await fs_exists(path, { baseDir: BaseDirectory.AppData });
            return res;
        } catch (e) {
            console.log(`e exists`, e)
            return false;
        };
    }

    public async open(path: string): Promise<IClientFsOpenResult | undefined> {
        try {
            const res = await fs_open(path, { read: true, baseDir: BaseDirectory.AppData });
            return res;
        } catch (e) {
            console.log(`e open`, e)
            return undefined;
        };
    }
}

import { exists as fs_exists } from '@tauri-apps/plugin-fs';
import type { IClientFs } from "./types";

export class TauriClientFs implements IClientFs {
    public async exists(path: string): Promise<boolean> {
        try {
            const res = await fs_exists(path);
            return res;
        } catch (e) {
            console.log(`e exists`, e)
            return false;
        };
    }

}

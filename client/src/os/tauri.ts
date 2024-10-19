import { err_msg, ErrorMessage, ResultObj } from '@radroots/utils';
import { arch, hostname, platform, version } from '@tauri-apps/plugin-os';
import type { IClientOs } from "./types";

export class TauriClientOs implements IClientOs {
    public version(): string {
        return version();
    }

    public platform(): string {
        return platform();
    }

    public arch(): string {
        return arch();
    }

    public async hostname(): Promise<ResultObj<string> | ErrorMessage<string>> {
        try {
            const result = await hostname();
            if (!result) return err_msg(`*-result`);
            return { result }
        } catch (e) {
            return err_msg(`*`);
        };
    }

}

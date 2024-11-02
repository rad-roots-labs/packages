import { app } from '@tauri-apps/api';
import type { IClientDevice, IClientDeviceMetadata } from "./types";

export class TauriClientDevice implements IClientDevice {
    private _metadata: IClientDeviceMetadata | undefined = undefined;

    public async init(opts: IClientDeviceMetadata): Promise<void> {
        this._metadata = opts;
    }

    public get metadata() {
        return this._metadata;
    }

    public async get_name(): Promise<string> {
        return await app.getName();
    }

    public async get_version(): Promise<string> {
        return await app.getVersion();
    }

    //public async set_theme(theme: `light` | `dark`) {
    //    return app.setTheme(theme);
    //}
}

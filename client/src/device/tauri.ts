import type { IClientDevice, IClientDeviceMetadata } from "./types";

export class TauriClientDevice implements IClientDevice {
    private _metadata: IClientDeviceMetadata | undefined = undefined;

    public async init(opts: IClientDeviceMetadata): Promise<void> {
        this._metadata = opts;
    }

    public get metadata() {
        return this._metadata;
    }
}

export type IClientDeviceMetadata = {
    version: string;
    platform: string;
    locale: string;
};

export type IClientDevice = {
    init(opts: IClientDeviceMetadata): Promise<void>;
};
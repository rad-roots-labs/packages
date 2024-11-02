export type IClientDeviceMetadata = {
    version: string;
    platform: string;
    locale: string;
};

export type IClientDevice = {
    init(opts: IClientDeviceMetadata): Promise<void>;
    get_name(): Promise<string>;
    get_version(): Promise<string>;
};
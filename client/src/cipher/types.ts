import { type IdbClientConfig } from "@radroots/utils";

export interface IClientCipher {
    get_config(): IdbClientConfig;
    reset(): Promise<void>;
    encrypt(data: Uint8Array): Promise<Uint8Array>;
    decrypt(blob: Uint8Array): Promise<Uint8Array>;
}

import { type IdbClientConfig, type ResolveError, type ResultPass } from "@radroots/utils";

export type ClientCipherEncryptResolve = ResolveError<Uint8Array>;
export type ClientCipherDecryptResolve = ResolveError<Uint8Array>;
export type ClientCipherResetResolve = ResolveError<ResultPass>;

export type WebAesGcmCipherConfig = {
    idb_config?: Partial<IdbClientConfig>;
    key_name?: string;
    key_length?: number;
    iv_length?: number;
    algorithm?: string;
};

export interface IClientCipher {
    get_config(): IdbClientConfig;
    reset(): Promise<ClientCipherResetResolve>;
    encrypt(data: Uint8Array): Promise<ClientCipherEncryptResolve>;
    decrypt(blob: Uint8Array): Promise<ClientCipherDecryptResolve>;
}

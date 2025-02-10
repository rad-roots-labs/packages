import type { ErrorMessage, ResultPass, ResultPublicKey, ResultSecretKey, ResultsList } from "@radroots/util";

export type ICoreDeviceMetadata = {
    os_arch: string;
    os_platform: string;
    os_version: string;
    app_name: string;
    app_version: string;
};

export type IClientKeysNostrCreateResolve = ResultPublicKey | ErrorMessage<string>;
export type IClientKeysNostrAddResolve = ResultPublicKey | ErrorMessage<string>;
export type IClientKeysNostrReadResolve = ResultSecretKey | ErrorMessage<string>;
export type IClientKeysNostrReadAllResolve = ResultsList<string> | ErrorMessage<string>;
export type IClientKeysNostrDeleteResolve = ResultPass | ErrorMessage<string>;
export type IClientKeysNostrKeystoreResetResolve = ResultPass | ErrorMessage<string>;

export type IClientKeys = {
    nostr_gen(): Promise<IClientKeysNostrCreateResolve>;
    nostr_add(secret_key: string): Promise<IClientKeysNostrAddResolve>;
    nostr_read(public_key: string): Promise<IClientKeysNostrReadResolve>;
    nostr_read_all(): Promise<IClientKeysNostrReadAllResolve>;
    nostr_delete(public_key: string): Promise<IClientKeysNostrDeleteResolve>;
    nostr_keystore_reset(): Promise<IClientKeysNostrKeystoreResetResolve>;
};
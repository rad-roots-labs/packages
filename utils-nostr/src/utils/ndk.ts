import NDK, { NDKCacheAdapter, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

export const create_ndk = (explicitRelayUrls: string[], cacheAdapter?: NDKCacheAdapter): NDK => {
    return new NDK({
        explicitRelayUrls,
        enableOutboxModel: false,
        cacheAdapter
    });
};

export const create_ndk_signer = (secret_key: string): NDKPrivateKeySigner => {
    return new NDKPrivateKeySigner(secret_key);
};
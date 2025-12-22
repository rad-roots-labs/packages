import { _env_lib } from "$lib/utils/_env";
import { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

let cache_adapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter = new NDKCacheAdapterDexie({ dbName: _env_lib.NDK_CACHE });

let cache_adapter_global: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter_global = new NDKCacheAdapterDexie({ dbName: `${_env_lib.NDK_CACHE}-global` });

const ndk_i = new NDKSvelte({ cacheAdapter: cache_adapter, clientName: _env_lib.NDK_CLIENT, explicitRelayUrls: [_env_lib.RADROOTS_RELAY], autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk = writable<NDKSvelte>(ndk_i);
export const ndk_user = writable<NDKUser>();

const ndk_global_i = new NDKSvelte({ cacheAdapter: cache_adapter_global, clientName: _env_lib.NDK_CLIENT, autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk_global = writable<NDKSvelte>(ndk_global_i);

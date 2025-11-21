import { _envLib } from "$lib/utils/_env";
import { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

let cache_adapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter = new NDKCacheAdapterDexie({ dbName: _envLib.NDK_CACHE });

let cache_adapter_global: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter_global = new NDKCacheAdapterDexie({ dbName: `${_envLib.NDK_CACHE}-global` });

const _ndk = new NDKSvelte({ cacheAdapter: cache_adapter, clientName: _envLib.NDK_CLIENT, explicitRelayUrls: [_envLib.RADROOTS_RELAY], autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk = writable<NDKSvelte>(_ndk);
export const ndk_user = writable<NDKUser>();

const _ndk_global = new NDKSvelte({ cacheAdapter: cache_adapter_global, clientName: _envLib.NDK_CLIENT, autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk_global = writable<NDKSvelte>(_ndk_global);

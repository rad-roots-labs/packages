import { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

const NDK_CACHE_NAME = import.meta.env.VITE_PUBLIC_NDK_CACHE_NAME;
if (!NDK_CACHE_NAME) throw new Error('Error: VITE_PUBLIC_NDK_CACHE_NAME is required');

const NDK_CLIENT_NAME = import.meta.env.VITE_PUBLIC_NDK_CLIENT_NAME;
if (!NDK_CLIENT_NAME) throw new Error('Error: VITE_PUBLIC_NDK_CLIENT_NAME is required');

const RADROOTS_MARKET_RELAY_URL = import.meta.env.VITE_PUBLIC_RADROOTS_MARKET_RELAY_URL
if (!RADROOTS_MARKET_RELAY_URL) throw new Error('Error: VITE_PUBLIC_RADROOTS_MARKET_RELAY_URL is required');

let cache_adapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter = new NDKCacheAdapterDexie({ dbName: NDK_CACHE_NAME });

let cache_adapter_global: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cache_adapter_global = new NDKCacheAdapterDexie({ dbName: `${NDK_CACHE_NAME}-global` });

const _ndk = new NDKSvelte({ cacheAdapter: cache_adapter, clientName: NDK_CLIENT_NAME, explicitRelayUrls: [RADROOTS_MARKET_RELAY_URL], autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk = writable<NDKSvelte>(_ndk);
export const ndk_user = writable<NDKUser>();

const _ndk_global = new NDKSvelte({ cacheAdapter: cache_adapter_global, clientName: NDK_CLIENT_NAME, autoConnectUserRelays: true, autoFetchUserMutelist: true });
export const ndk_global = writable<NDKSvelte>(_ndk_global);

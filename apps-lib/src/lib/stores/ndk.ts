import { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

const NDK_CACHE_NAME = import.meta.env.VITE_PUBLIC_NDK_CACHE_NAME;
if (!NDK_CACHE_NAME) throw new Error('Error: VITE_PUBLIC_NDK_CACHE_NAME is required');

const NDK_CLIENT_NAME = import.meta.env.VITE_PUBLIC_NDK_CLIENT_NAME;
if (!NDK_CLIENT_NAME) throw new Error('Error: VITE_PUBLIC_NDK_CLIENT_NAME is required');

let cacheAdapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cacheAdapter = new NDKCacheAdapterDexie({ dbName: NDK_CACHE_NAME });

const ndk_svelte = new NDKSvelte({
  cacheAdapter,
  clientName: NDK_CLIENT_NAME,
});

export const ndk = writable<NDKSvelte>(ndk_svelte);
export const ndk_user = writable<NDKUser>();

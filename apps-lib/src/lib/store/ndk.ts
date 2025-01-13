import { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

//@ts-ignore
const ndk_cache_name = import.meta.env.VITE_PUBLIC_NDK_CACHE_NAME;
if (!ndk_cache_name) throw new Error('Error: VITE_PUBLIC_NDK_CACHE_NAME is required');

//@ts-ignore
const ndk_client_name = import.meta.env.VITE_PUBLIC_NDK_CLIENT_NAME;
if (!ndk_client_name) throw new Error('Error: VITE_PUBLIC_NDK_CLIENT_NAME is required');


let cacheAdapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cacheAdapter = new NDKCacheAdapterDexie({ dbName: ndk_cache_name });

const _ndk = new NDKSvelte({
  cacheAdapter,
  clientName: ndk_client_name,
});

export const ndk = writable<NDKSvelte>(_ndk);
export const ndk_user = writable<NDKUser>();

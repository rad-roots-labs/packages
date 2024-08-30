import NDK, { type NDKCacheAdapter, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { writable } from "svelte/store";

let cacheAdapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cacheAdapter = new NDKCacheAdapterDexie({ dbName: "-radroots-app-ndk" });

const _ndk = new NDK({
  cacheAdapter,
  clientName: "»--`--,---",
});

export const ndk = writable<NDK>(_ndk);
export const ndk_user = writable<NDKUser>();

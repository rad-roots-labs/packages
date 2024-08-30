import type { NDKCacheAdapter } from "@nostr-dev-kit/ndk";
import { type NDKUser } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { writable } from "svelte/store";

let cacheAdapter: NDKCacheAdapter | undefined;
if (typeof window !== `undefined`) cacheAdapter = new NDKCacheAdapterDexie({ dbName: "-radroots-app-ndk" });

const _ndk = new NDKSvelte({
  cacheAdapter,
  clientName: "Radroots",
});

export const ndk = writable<NDKSvelte>(_ndk);
export const ndk_user = writable<NDKUser>();

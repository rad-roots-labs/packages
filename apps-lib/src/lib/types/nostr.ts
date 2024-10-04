import type { NDKEvent } from "@nostr-dev-kit/ndk";
import type { ExtendedBaseType, NDKEventStore } from "@nostr-dev-kit/ndk-svelte";

export type NostrEventStore = NDKEventStore<ExtendedBaseType<NDKEvent>>
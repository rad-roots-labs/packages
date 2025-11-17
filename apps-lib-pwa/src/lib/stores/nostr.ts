import { writable } from "svelte/store";

export const nostr_ndk_configured = writable(false);

export const nostr_sync_prevent = writable(false);
export const nostr_sync_attempts = writable(0);
export const nostr_sync_attempts_max = writable(8);
export const nostr_sync_stop = writable(true);

export const nostr_poll_relays_prevent = writable(false);
export const nostr_poll_relays_attempts = writable(0);
export const nostr_poll_relays_attempts_max = writable(0);
export const nostr_poll_relays_stop = writable(true);

export const nostr_relays_connected = writable<string[]>([]);


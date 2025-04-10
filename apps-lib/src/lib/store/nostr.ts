import { get_store } from "$root";
import { writable } from "svelte/store";

export const nostr_ndk_configured = writable<boolean>(false);
export const nostr_sync_prevent = writable<boolean>(false);
export const nostr_sync_attempts = writable(0);
export const nostr_sync_attempts_max = writable(8);
export const nostr_sync_failure = writable(true);
/*
export const nostr_relays_poll_documents = writable<boolean>(false);
export const nostr_relays_poll_documents_count = writable<number>(0);
export const nostr_relays_connected = writable<string[]>([]);
*/

export const nostr_sync_retry_handler = async (callback: () => Promise<any>) => {
    let current_count = 0;
    const attempts_max = get_store(nostr_sync_attempts_max);

    nostr_sync_attempts.set(0);
    nostr_sync_failure.set(false);

    const exe = async () => {
        if (get_store(nostr_sync_failure)) return;
        try {
            await callback();
        } catch (e) {
            current_count += 1;
            nostr_sync_attempts.set(current_count);
            if (current_count < attempts_max) {
                await new Promise((res) => setTimeout(res, 500));
                await exe();
            } else nostr_sync_failure.set(true);
        }
    };

    await exe();
};
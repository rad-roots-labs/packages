import { get_store, nostr_poll_relays_attempts, nostr_poll_relays_attempts_max, nostr_poll_relays_stop, nostr_sync_attempts, nostr_sync_attempts_max, nostr_sync_stop } from "$root";

export const nostr_sync_retry_handler = async (callback: () => Promise<any>) => {
    let current_count = 0;
    const attempts_max = get_store(nostr_sync_attempts_max);

    nostr_sync_attempts.set(0);
    nostr_sync_stop.set(false);

    const exe = async () => {
        if (get_store(nostr_sync_stop)) return;
        console.log(`nostr_sync_retry_handler ${current_count}`)
        try {
            await callback();
        } catch (e) {
            current_count += 1;
            nostr_sync_attempts.set(current_count);
            if (current_count < attempts_max) {
                await new Promise((res) => setTimeout(res, 500));
                await exe();
            } else nostr_sync_stop.set(true);
        }
    };

    await exe();
};

export const nostr_poll_relays_retry_handler = async (callback: () => Promise<any>) => {
    let current_count = 0;
    const attempts_max = get_store(nostr_poll_relays_attempts_max);

    nostr_poll_relays_attempts.set(0);
    nostr_poll_relays_stop.set(false);

    const exe = async () => {
        if (get_store(nostr_poll_relays_stop)) return;
        console.log(`nostr_poll_relays_retry_handler ${current_count}`)
        try {
            await callback();
        } catch (e) {
            current_count += 1;
            nostr_poll_relays_attempts.set(current_count);
            if (current_count < attempts_max) {
                await new Promise((res) => setTimeout(res, 2000));
                await exe();
            } else nostr_poll_relays_stop.set(true);
        }
    };

    await exe();
};

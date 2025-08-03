import { get_store, handle_err, ndk_user, nostr_sync, nostr_sync_attempts, nostr_sync_attempts_max, nostr_sync_prevent, nostr_sync_stop } from "$root";
import { throw_err, type CallbackPromiseFull, type CallbackPromiseGeneric, type I18nTranslateFunction } from "@radroots/util";
import type { INostrMetadata } from "@radroots/utils-nostr";

export const nostr_sync_retry_handler = async (callback: () => Promise<any>) => {
    let current_count = 0;
    const attempts_max = get_store(nostr_sync_attempts_max);

    nostr_sync_attempts.set(0);
    nostr_sync_stop.set(false);

    const exe = async () => {
        if (get_store(nostr_sync_stop)) return;
        console.log(`[nostr sync] attempt ${current_count}`)
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

export const nostr_sync_handler = async (opts: {
    ls: I18nTranslateFunction;
    callback_alert: CallbackPromiseGeneric<string>;
    callback_confirm: CallbackPromiseFull<string, boolean>;
    callback_metadata: CallbackPromiseFull<string, INostrMetadata>;
    callback_relay_urls: CallbackPromiseFull<string, { id: string; url: string; }[]>;
}): Promise<void> => {
    try {
        const { ls, callback_alert, callback_confirm, callback_metadata, callback_relay_urls } = opts;
        const $ls = get_store(ls);
        const $ndk_user = get_store(ndk_user);
        const public_key = $ndk_user.pubkey;
        if (!public_key) return void await callback_alert(`${$ls(`error.client.nostr.missing_public_key`)}`);

        const $nostr_sync_prevent = get_store(nostr_sync_prevent);
        if ($nostr_sync_prevent) {
            const confirm = await callback_confirm(`${$ls(`error.client.nostr.sync_disabled`)}`);
            if (confirm) nostr_sync_prevent.set(false);
            else return;
        }

        const metadata = await callback_metadata(public_key);
        const ev = await nostr_sync.metadata({ metadata });
        if (`err` in ev) throw_err(ev);
        await ev.publish();

        const relays = await callback_relay_urls(public_key);
        for (const relay of relays) {
            //@todo
        }
    } catch (e) {
        await handle_err(e, `nostr_sync_handler`);
    }
};
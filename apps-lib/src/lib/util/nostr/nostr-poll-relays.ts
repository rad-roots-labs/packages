import { get_store, handle_err, ndk_user, nostr_poll_relays_attempts, nostr_poll_relays_attempts_max, nostr_poll_relays_stop, nostr_relays_connected } from "$root";
import { type CallbackPromiseFull, type CallbackPromiseGeneric, type ErrorMessage, type I18nTranslateFunction, type IHttpResponse } from "@radroots/util";
import { lib_nostr_relay_build_information_document, type NostrRelayInformationDocumentFields } from "@radroots/utils-nostr";

export const nostr_poll_relays_retry_handler = async (callback: () => Promise<any>) => {
    let current_count = 0;
    const attempts_max = get_store(nostr_poll_relays_attempts_max);

    nostr_poll_relays_attempts.set(0);
    nostr_poll_relays_stop.set(false);

    const exe = async () => {
        if (get_store(nostr_poll_relays_stop)) return;
        console.log(`[nostr poll relays] attempt ${current_count}`)
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

export const nostr_poll_relays_handler = async (opts: {
    ls: I18nTranslateFunction;
    callback_alert: CallbackPromiseGeneric<string>;
    callback_relay_urls: CallbackPromiseFull<string, { id: string; url: string; }[]>;
    callback_fetch_document: CallbackPromiseFull<string, IHttpResponse | ErrorMessage<string>>;
    callback_set_relay_document: CallbackPromiseGeneric<{ url: string; doc: NostrRelayInformationDocumentFields; }>;
}): Promise<void> => {
    try {
        const { ls, callback_alert, callback_relay_urls, callback_fetch_document, callback_set_relay_document } = opts;
        const $ls = get_store(ls);
        const $ndk_user = get_store(ndk_user);
        const public_key = $ndk_user?.pubkey;
        if (!public_key) return void await callback_alert(`${$ls(`error.client.nostr.missing_public_key`)}`);
        const $nostr_relays_connected = get_store(nostr_relays_connected);

        const relay_urls = await callback_relay_urls(public_key);
        const unconnected_relays = relay_urls.filter(
            (i) => !$nostr_relays_connected.includes(i.id),
        );
        if (unconnected_relays.length === 0) return void nostr_poll_relays_stop.set(true);

        for (const relay of unconnected_relays) {
            const res = await callback_fetch_document(relay.url);
            if (`err` in res) continue;
            else if (res.status === 200 && res.data) {
                const doc = lib_nostr_relay_build_information_document(res.data);
                if (!doc) continue;
                await callback_set_relay_document({ url: relay.url, doc });
                nostr_relays_connected.set(
                    Array.from(
                        new Set([
                            ...$nostr_relays_connected,
                            relay.id,
                        ]),
                    ),
                );
            }

        }
    } catch (e) {
        await handle_err(e, `nostr_poll_relays_handler`);
    }
};

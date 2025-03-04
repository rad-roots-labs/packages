import type { NavigationPreviousParam } from "@radroots/util";
import { writable } from "svelte/store";
import { queryParam, queryParameters } from "sveltekit-search-params";

export const qp = queryParameters();
export const qp_id = queryParam<string>("id");
export const qp_ref = queryParam<string>("ref");
export const qp_lat = queryParam<string>("lat");
export const qp_lng = queryParam<string>("lng");
export const qp_field = queryParam<string>("field");
export const qp_keynostr = queryParam<string>("key_nostr");

export const app_pwa_polyfills = writable<boolean>(false);

export const nav_visible = writable<boolean>(false);
export const nav_blur = writable<boolean>(false);
export const nav_prev = writable<NavigationPreviousParam<string>[]>([]);

export const layout_view_cover = writable<boolean>(false);

export const tabs_visible = writable<boolean>(false);
export const tabs_blur = writable<boolean>(false);
export const tabs_active = writable<number>(0);

export const ph_blur = writable<boolean>(false);

export const carousel_active = writable<boolean>(false);
export const carousel_index = writable<number>(0);
export const carousel_index_max = writable<number>(0);
const fn_carousel_num = (num_i: number, num_min: number) => {
    const store = writable<number>(num_i);
    return {
        subscribe: store.subscribe,
        set: (num: number) => {
            store.set(Math.max(num, num_min));
        },
        update: (updater: (num: number) => number) => {
            store.update((num) => Math.max(updater(num), num_min));
        }
    };
}
export const carousel_num = fn_carousel_num(1, 1);
export const envelope_visible = writable<boolean>(false);
export const envelope_tilt = writable<boolean>(true);

export const nostr_ndk_configured = writable<boolean>(false);
export const nostr_relays_poll_documents = writable<boolean>(false);
export const nostr_relays_poll_documents_count = writable<number>(0);
export const nostr_relays_connected = writable<string[]>([]);
export const nostr_sync_prevent = writable<boolean>(false);


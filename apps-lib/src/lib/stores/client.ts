import { type AppConfigType, type AppLayoutKey, type IToast, type NavigationPreviousParam, } from "$lib";
import type { ColorMode, ThemeKey } from "@radroots/theme";
import { writable } from "svelte/store";
import { queryParam, queryParameters } from "sveltekit-search-params";

//@ts-ignore
const kv_name = import.meta.env.VITE_PUBLIC_KV_NAME;
if (!kv_name) throw new Error('Error: VITE_PUBLIC_KV_NAME is required');

export const qp = queryParameters();
export const qp_nostr_pk = queryParam<string>("nostr_pk");
export const qp_rkey = queryParam<string>("rkey");
export const qp_id = queryParam<string>("id");
export const qp_lat = queryParam<string>("lat");
export const qp_lng = queryParam<string>("lng");

export let kv: Keyva;
if (typeof window !== 'undefined') kv = new Keyva({ name: kv_name });

export const app_layout = writable<AppLayoutKey>(`mobile_base`);
export const app_cfg_type = writable<AppConfigType>(`personal`);
export const app_render = writable<boolean>(false);
export const app_tilt = writable<boolean>(false);
export const app_loading = writable<boolean>(false);
export const app_splash = writable<boolean>(true);
export const app_win = writable<{ h: number, w: number }>({ h: 0, w: 0 });
export const app_notify = writable<string>(``);
export const app_toast = writable<IToast | false>(false);
export const app_submit_route = writable<NavigationPreviousParam | undefined>(undefined);
export const app_blur = writable<boolean>(false);
export const app_db = writable<boolean>(false);
export const app_geoc = writable<boolean>(false);
export const app_thc = writable<ColorMode>(`light`);
export const app_th = writable<ThemeKey>(`os`);
export const app_nostr_key = writable<string>(``);
export const app_nostr_profiles = writable<string[]>([]);

export const app_pwa_polyfills = writable<boolean>(false);

export const nav_visible = writable<boolean>(false);
export const nav_blur = writable<boolean>(false);
export const nav_prev = writable<NavigationPreviousParam[]>([]);

export const layout_view_cover = writable<boolean>(false);

export const tabs_visible = writable<boolean>(false);
export const tabs_blur = writable<boolean>(false);
export const tabs_active = writable<number>(0);

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


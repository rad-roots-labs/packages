import { type AppLayoutKey, type IToast, type NavigationPreviousParam, type NavigationRouteParamId, type NavigationRouteParamLat, type NavigationRouteParamLng, type NavigationRouteParamNostrPublicKey, type NavigationRouteParamRecordKey } from "$lib";
import { writable } from "svelte/store";
import { queryParam, queryParameters } from "sveltekit-search-params";

//@ts-ignore
const kv_name = import.meta.env.VITE_PUBLIC_KV_NAME;
if (!kv_name) throw new Error('Error: VITE_PUBLIC_KV_NAME is required');

export const qp = queryParameters();
export const qp_nostr_pk = queryParam<NavigationRouteParamNostrPublicKey>("nostr_pk");
export const qp_rkey = queryParam<NavigationRouteParamRecordKey>("rkey");
export const qp_id = queryParam<NavigationRouteParamId>("id");
export const qp_lat = queryParam<NavigationRouteParamLat>("lat");
export const qp_lng = queryParam<NavigationRouteParamLng>("lng");

export let kv: Keyva;
if (typeof window !== 'undefined') kv = new Keyva({ name: kv_name });

export const app_layout = writable<AppLayoutKey>(`base`);
export const app_config = writable<boolean>(false);
export const app_render = writable<boolean>(false);
export const app_win = writable<[number, number]>([0, 0]);
export const app_notify = writable<string>(``);
export const app_toast = writable<IToast | false>(false);
export const app_submit_route = writable<NavigationPreviousParam | undefined>(undefined);
export const app_blur = writable<boolean>(false);

export const nav_visible = writable<boolean>(false);
export const nav_blur = writable<boolean>(false);
export const nav_prev = writable<NavigationPreviousParam[]>([]);

export const tabs_visible = writable<boolean>(false);
export const tabs_blur = writable<boolean>(false);
export const app_tab_active = writable<number>(0);

export const nostr_ndk_configured = writable<boolean>(false);
export const nostr_relays_poll_documents = writable<boolean>(false);
export const nostr_relays_poll_documents_count = writable<number>(0);
export const nostr_relays_connected = writable<string[]>([]);


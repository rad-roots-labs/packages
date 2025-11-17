import type { BrowserPlatformInfo, NavigationPreviousParam, NavigationRouteParamField, NavigationRouteParamId, NavigationRouteParamLat, NavigationRouteParamLng, NavigationRouteParamNostrPublicKey, NavigationRouteParamRef } from "@radroots/apps-lib";
import { writable } from "svelte/store";
import { queryParam } from "sveltekit-search-params";

export const app_tilt = writable<boolean>(false);
export const app_lo = writable<string>("");
export const app_notify = writable<string>(``);
export const app_splash = writable<boolean>(true);
export const app_loading = writable<boolean>(false);
export const app_platform = writable<BrowserPlatformInfo | undefined>(undefined);

export const cfg_role = writable<string>();
export const cfg_setup = writable<boolean | undefined>(undefined);

export const envelope_visible = writable<boolean>(false);
export const envelope_tilt = writable<boolean>(true);

export const nav_visible = writable<boolean>(false);
export const nav_blur = writable<boolean>(false);
export const nav_prev = writable<NavigationPreviousParam<string>[]>([]);

export const ph_blur = writable<boolean>(false);

export const tabs_visible = writable<boolean>(false);
export const tabs_blur = writable<boolean>(false);
export const tabs_active = writable<number>(0);

export const qp_id = queryParam<NavigationRouteParamId>("id");
export const qp_field = queryParam<NavigationRouteParamField>("field");
export const qp_ref = queryParam<NavigationRouteParamRef>("ref");
export const qp_lat = queryParam<NavigationRouteParamLat>("lat");
export const qp_lng = queryParam<NavigationRouteParamLng>("lng");
export const qp_keynostr = queryParam<NavigationRouteParamNostrPublicKey>("key_nostr");

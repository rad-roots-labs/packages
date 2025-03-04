import type { ColorMode, ThemeKey } from "@radroots/theme";
import type { AppConfigType, AppLayoutKey, BrowserPlatformInfo, IToast } from "@radroots/util";
import { writable } from "svelte/store";

export const app_lo = writable<AppLayoutKey>();
export const app_platform = writable<BrowserPlatformInfo | undefined>(undefined);
export const app_cfg_type = writable<AppConfigType>(`personal`);
export const app_init = writable<boolean>(false);
export const app_tilt = writable<boolean>(false);
export const app_loading = writable<boolean>(false);
export const app_splash = writable<boolean>(true);
export const app_notify = writable<string>(``);
export const app_toast = writable<IToast | false>(false);
export const app_blur = writable<boolean>(false);
export const app_db = writable<boolean>(false);
export const app_geoc = writable<boolean>(false);
export const app_thc = writable<ColorMode>(`light`);
export const app_th = writable<ThemeKey>();
export const app_nostr_profiles = writable<string[]>([]);
export const app_load = writable<boolean>(false);

export const search_results = writable<any[]>([]);

export const win_h = writable<number>(0);
export const win_w = writable<number>(0);

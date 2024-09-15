import { type AppLayoutKey } from "$lib";
import { queryParameters } from "@radroots/sveltekit-search-params";
import { type ColorMode, type ThemeKey } from "@radroots/theme";
import { writable } from "svelte/store";

//@ts-ignore
const kv_name = import.meta.env.VITE_PUBLIC_KV_NAME;
if (!kv_name) throw new Error('Error: VITE_PUBLIC_KV_NAME is required');

export const app_qp = queryParameters();

export let kv: Keyva;
if (typeof window !== 'undefined') kv = new Keyva({ name: kv_name });

export const app_thc = writable<ColorMode>(`light`);
export const app_th = writable<ThemeKey>(`earth`);

export const app_layout = writable<AppLayoutKey>(`base`);
export const app_config = writable<boolean>(false);
export const app_render = writable<boolean>(false);
export const app_win = writable<[number, number]>([0, 0]);

export const app_nav_visible = writable<boolean>(false);
export const app_nav_blur = writable<boolean>(false);

export const app_tabs_visible = writable<boolean>(false);
export const app_tabs_blur = writable<boolean>(false);
export const app_tab_active = writable<number>(0);

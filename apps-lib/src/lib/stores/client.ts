import { type AppLayoutKey } from "$lib";
import { queryParameters } from "@radroots/sveltekit-search-params";
import { writable } from "svelte/store";

export const app_qp = queryParameters();

export const kv = writable<Keyva>();
if (typeof window !== 'undefined') kv.set(new Keyva({ name: 'app-kv' }));

export const app_layout = writable<AppLayoutKey>(`base`);

export const app_nav_visible = writable<boolean>(false);
export const app_nav_blur = writable<boolean>(false);

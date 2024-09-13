import { type AppLayoutKey } from "$lib";
import { queryParameters } from "@radroots/sveltekit-search-params";
import { writable } from "svelte/store";

//@ts-ignore
const kv_name = import.meta.env.VITE_PUBLIC_KV_NAME;
if (!kv_name) throw new Error('Error: VITE_PUBLIC_KV_NAME is required');

export const app_qp = queryParameters();

export let kv: Keyva;
if (typeof window !== 'undefined') kv = new Keyva({ name: kv_name });

export const app_layout = writable<AppLayoutKey>(`base`);

export const app_nav_visible = writable<boolean>(false);
export const app_nav_blur = writable<boolean>(false);

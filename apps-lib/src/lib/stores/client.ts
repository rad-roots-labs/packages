import { queryParameters } from "@radroots/sveltekit-search-params";
import { writable } from "svelte/store";

export const app_qp = queryParameters();

export const kv = writable<Keyva>();
if (typeof window !== 'undefined') kv.set(new Keyva({ name: 'app-kv' }));

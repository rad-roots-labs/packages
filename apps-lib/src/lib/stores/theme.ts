import type { ThemeMode } from "$lib/types/lib";
import { get_store } from "$lib/utils/lib";
import { type CallbackPromiseGeneric } from "@radroots/utils";
import { writable } from "svelte/store";

export const theme_mode = writable<ThemeMode>(`light`);
export const theme_key = writable<string>(`default`);

export const theme_toggle = async (callback: CallbackPromiseGeneric<ThemeMode>): Promise<void> => {
    const mode = get_store(theme_mode) === `light` ? `dark` : `light`;
    theme_mode.set(mode);
    await callback(mode);
};
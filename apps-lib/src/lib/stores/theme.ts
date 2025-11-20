import { get_store } from "$lib/utils/app/lib";
import type { ThemeKey, ThemeMode } from "@radroots/themes";
import { type CallbackPromiseGeneric } from "@radroots/utils";
import { writable } from "svelte/store";

export const theme_mode = writable<ThemeMode>();
export const theme_key = writable<ThemeKey>();
export const theme_reset = writable<boolean>(false);

export const theme_toggle = async (callback: CallbackPromiseGeneric<ThemeMode>): Promise<void> => {
    const mode = get_store(theme_mode) === `light` ? `dark` : `light`;
    theme_mode.set(mode);
    await callback(mode);
};

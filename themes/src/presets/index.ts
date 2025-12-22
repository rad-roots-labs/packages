import { ThemeKey } from "../core/types.js";
import { theme_os_preset } from "./os/index.js";
import { ThemePreset } from "./types.js";

export const theme_presets: Record<ThemeKey, ThemePreset> = {
    os: theme_os_preset,
};
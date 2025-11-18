import { ThemePreset } from "../types.js";
import { os_dark_theme } from "./os-theme-dark.js";
import { os_light_theme } from "./os-theme-light.js";

export const theme_os_preset: ThemePreset = {
    light: os_light_theme,
    dark: os_dark_theme
}
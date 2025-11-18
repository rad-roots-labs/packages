import type { ThemeKey, ThemeMode } from "./types.js";

export const parse_theme_mode = (value?: string | null): ThemeMode => {
    if (value === "dark") return "dark";
    return "light";
};

export const parse_theme_key = (value?: string | null): ThemeKey => {
    switch (value) {
        case "os": return value;
        default: return "os";
    }
};

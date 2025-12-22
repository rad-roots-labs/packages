import { theme_app_layout } from "./app/index.js";
import { ThemeLayoutKey, ThemeLayoutParam } from "./types.js";

export const theme_layouts: Record<ThemeLayoutKey, ThemeLayoutParam> = {
    app: theme_app_layout,
};
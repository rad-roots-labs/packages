import type {
    TailwindThemeConfig,
    TailwindThemeNamespace,
    ThemeLayoutEntry,
    ThemeVariable
} from "./types.js";

export const with_prefix = (
    prefix: string,
    source: ThemeLayoutEntry
): ThemeLayoutEntry =>
    Object.fromEntries(
        Object.entries(source).map(([key, value]) => [`${prefix}${key}`, value])
    );

const to_theme_variables = (
    namespace: TailwindThemeNamespace,
    scale: ThemeLayoutEntry
): ThemeVariable[] =>
    Object.entries(scale).map(([name, value]) => ({
        namespace,
        name,
        value
    }));

export const build_theme_layout_variables = (
    config: TailwindThemeConfig
): ThemeVariable[] => [
        ...to_theme_variables("height", config.height),
        ...to_theme_variables("width", config.width),
        ...to_theme_variables("min-height", config.min_height),
        ...to_theme_variables("max-height", config.max_height),
        ...to_theme_variables("min-width", config.min_width),
        ...to_theme_variables("max-width", config.max_width),
        ...to_theme_variables("padding", config.padding),
        ...to_theme_variables("translate", config.translate),
        ...to_theme_variables("spacing", config.spacing)
    ];

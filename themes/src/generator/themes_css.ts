import type { ThemeId, ThemeKey, ThemeMode } from "../core/types.js";
import { theme_presets } from "../presets/index.js";
import type { OsThemePreset, ThemePreset } from "../presets/types.js";
import {
    collect_theme_color_entries,
    format_hsl,
    select_theme_presets_keys,
    theme_modes,
    to_css_name_suffix
} from "./theme_utils.js";

export interface PluginOptions {
    id: ThemeId;
    prefers_dark: boolean;
    color_scheme: ThemeMode;
    theme: OsThemePreset;
}

export const build_theme_css = (options: PluginOptions): string => {
    const lines: string[] = [];
    lines.push('@plugin "daisyui/theme" {');
    lines.push(`    name: "${options.id}";`);
    lines.push("    default: false;");
    lines.push(`    prefersdark: ${options.prefers_dark ? "true" : "false"};`);
    lines.push(`    color-scheme: ${options.color_scheme};`);

    const entries = collect_theme_color_entries(options.theme);

    for (const entry of entries) {
        const layer = options.theme[entry.layer_key];
        const layer_prefix = `--color-${entry.layer_key}`;
        const suffix = to_css_name_suffix(entry.token_key);

        if (entry.category === "surfaces") {
            const surfaces = layer.surfaces;
            const color = surfaces[entry.token_key as keyof typeof surfaces];
            const css_var_name = `${layer_prefix}${suffix}`;
            lines.push(`    ${css_var_name}: ${format_hsl(color)};`);
        } else {
            const glyphs = layer.glyphs;
            const color = glyphs[entry.token_key as keyof typeof glyphs];
            const css_var_name = `${layer_prefix}-gl${suffix}`;
            lines.push(`    ${css_var_name}: ${format_hsl(color)};`);
        }
    }

    lines.push("}");
    lines.push("");

    return lines.join("\n");
};

const build_theme_blocks = (
    theme_key: ThemeKey,
    preset: ThemePreset
): string[] => {
    const blocks: string[] = [];

    for (const mode of theme_modes) {
        const theme = preset[mode];
        const id: ThemeId = `${theme_key}_${mode}`;
        const block = build_theme_css({
            id,
            prefers_dark: mode === "dark",
            color_scheme: mode,
            theme
        });
        blocks.push(block);
    }

    return blocks;
};

export const build_themes_css_by_preset = (
    presets: string[] | undefined
): Record<ThemeKey, string> => {
    const selected_theme_keys = select_theme_presets_keys(presets);
    const css_by_preset = {} as Record<ThemeKey, string>;

    for (const theme_key of selected_theme_keys) {
        const preset = theme_presets[theme_key];
        const blocks = build_theme_blocks(theme_key, preset);
        css_by_preset[theme_key] = blocks.join("\n");
    }

    return css_by_preset;
};

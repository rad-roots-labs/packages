import { theme_presets } from "../presets/index.js";
import {
    collect_theme_color_entries,
    select_theme_presets_keys,
    theme_modes,
    to_css_name_suffix
} from "./theme_utils.js";

export interface StyleVariable {
    color_var_name: string;
    token_var_name: string;
}

export const build_styles_css = (variables: StyleVariable[]): string => {
    const lines: string[] = [];
    lines.push('@import "tailwindcss";');
    lines.push("");
    lines.push("@theme {");

    for (const v of variables) {
        lines.push(
            `  ${v.color_var_name}: hsl(var(${v.token_var_name}) / <alpha-value>);`
        );
    }

    lines.push("}");
    lines.push("");

    return lines.join("\n");
};

export const build_styles_css_from_presets = (
    presets: string[] | undefined
): string => {
    const selected = select_theme_presets_keys(presets);
    const map = new Map<string, string>();

    for (const key of selected) {
        const preset = theme_presets[key];

        for (const mode of theme_modes) {
            const theme = preset[mode];
            const entries = collect_theme_color_entries(theme);

            for (const entry of entries) {
                const suffix = to_css_name_suffix(entry.token_key);
                const layer_prefix = `--${entry.layer_key}`;

                const color =
                    entry.category === "surfaces"
                        ? `--color-${entry.layer_key}${suffix}`
                        : `--color-${entry.layer_key}-gl${suffix}`;

                const token =
                    entry.category === "surfaces"
                        ? `${layer_prefix}${suffix}`
                        : `${layer_prefix}-gl${suffix}`;

                if (!map.has(color)) {
                    map.set(color, token);
                }
            }
        }
    }

    const list: StyleVariable[] = [...map.entries()].map(
        ([color_var_name, token_var_name]) => ({
            color_var_name,
            token_var_name
        })
    );

    return build_styles_css(list);
};

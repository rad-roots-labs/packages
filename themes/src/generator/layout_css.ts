import type { ThemeVariable } from "../layout/types.js";
import {
    collect_layout_variables,
    select_theme_layout_keys
} from "./theme_utils.js";

export const build_layout_css = (variables: ThemeVariable[]): string => {
    const sorted = [...variables].sort((a, b) => {
        if (a.namespace !== b.namespace) {
            return a.namespace.localeCompare(b.namespace);
        }
        return a.name.localeCompare(b.name);
    });

    const lines: string[] = [];
    lines.push('@import "tailwindcss";');
    lines.push("");
    lines.push("@theme {");

    for (const variable of sorted) {
        const css_var_name = `--${variable.namespace}-${variable.name}`;
        lines.push(`  ${css_var_name}: ${variable.value};`);
    }

    lines.push("}");
    lines.push("");

    return lines.join("\n");
};

export const build_layout_css_from_presets = (
    presets: string[] | undefined
): string => {
    const selected_layout_keys = select_theme_layout_keys(presets);
    const layout_variables = collect_layout_variables(selected_layout_keys);
    return build_layout_css(layout_variables);
};

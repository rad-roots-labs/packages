import type { LabelFieldKind } from "$lib/types/client";
import type { ColorMode, ThemeKey, ThemeLayer } from "@radroots/theme";

export const sleep = async (ms: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};

export const theme_set = (theme_key: ThemeKey, color_mode: ColorMode): void => {
    const data_theme = `${theme_key}_${color_mode}`;
    document.documentElement.setAttribute("data-theme", data_theme);
};

export const toggle_color_mode = (color_mode: ColorMode): ColorMode => {
    return color_mode === `light` ? `dark` : `light`;
};

export const fmt_cl = (classes?: string): string => {
    return classes ? classes : ``;
};

export function get_label_classes(layer: ThemeLayer, label_kind: LabelFieldKind | undefined, hide_active: boolean): string {
    return `text-layer-${layer}-glyph${label_kind ? `-${label_kind}` : ``} ${hide_active ? `` : `group-active:text-layer-${layer}-glyph${label_kind ? `-${label_kind}_a` : `_a`}`}`
}

export function parse_layer(layer?: number): ThemeLayer {
    switch (layer) {
        case 0:
        case 1:
        case 2:
            return layer;
        default:
            return 0;
    }
};

export function fmt_trellis(hide_border_t: boolean, hide_border_b: boolean): string {
    return `${hide_border_t ? `group-first:border-t-0` : `group-first:border-t-line`} ${hide_border_b ? `group-last:border-b-0` : `group-last:border-b-line`}`;
};
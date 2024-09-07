import type { AnchorRoute, LabelFieldKind, NavigationParamTuple, NavigationRouteParamKey } from "$lib/types/client";
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
};

export function parse_layer(layer?: number, layer_default?: ThemeLayer): ThemeLayer {
    switch (layer) {
        case 0:
        case 1:
        case 2:
            return layer;
        default:
            return layer_default ? layer_default : 0;
    };
};

export function fmt_trellis(hide_border_t: boolean, hide_border_b: boolean): string {
    return `${hide_border_t ? `group-first:border-t-0` : `group-first:border-t-line`} ${hide_border_b ? `group-last:border-b-0` : `group-last:border-b-line`}`;
};

export function encode_qp(params_list?: NavigationParamTuple[]): string {
    if (!params_list || !params_list.length) return ``;
    const params = params_list.filter(i => i[0] && i[1])
    let urlp = ``;
    if (params_list.length) for (const [i, [k, v]] of params.entries()) urlp += `${i === 0 ? `?` : ``}&${k.trim()}=${encodeURI(v.trim())}`.trim();
    return urlp;
};

export const decode_qp = (query_param: string): AnchorRoute => {
    const route = decodeURI(query_param).replaceAll(`//`, `/`);
    return `/${route.charAt(0) === `/` ? route.slice(1) : route}`;
};

export function parse_qp(param: string): NavigationRouteParamKey | undefined {
    switch (param) {
        case "cmd":
        case "pk":
        case "id":
            return param;
        default:
            return undefined;
    };
};

export function time_now_ms(): number {
    return Math.floor(new Date().getTime() / 1000);
};

export const fmt_id = (id: string): string => {
    const pref = location.pathname.slice(1, -1).replaceAll(`-`, `_`).replaceAll(`/`, `-`).replaceAll(`--`, `-`)
    return `${pref}-${id}`
};

export const fmt_capitalize = (val: string): string => {
    const fmt = val.split(` `).map(i => `${i.charAt(0).toUpperCase()}${i.slice(1)}`).join(` `);
    return fmt;
};

export const zoom_step = (num: number, op: `inc` | `dec`): number => {
    const int_num = Math.round(num);
    if (op === 'inc') return Math.min(int_num + 1, 14);
    else return Math.max(int_num - 1, 0);
};


import type { AppLayoutKey, AppLayoutKeyIOS, AppLayoutKeyWeb, AppLayoutKeyWebPwa, LabelFieldKind, NavigationParamTuple, ThemeLayer } from "$root";

export const fmt_cl = (classes?: string): string => {
    return classes ? classes : ``;
};

export const get_layout = (val?: string): AppLayoutKey | undefined => {
    const lo_ios = get_ios_layout(val);
    if (lo_ios) return lo_ios;
    const lo_web = get_web_layout(val);
    if (lo_web) return lo_web;
    const lo_web_pwa = get_web_pwa_layout(val);
    if (lo_web_pwa) return lo_web_pwa;
    return undefined;
};

export const get_layout_default = (val?: string): AppLayoutKey => {
    const res = get_layout(val);
    return res || `web0`;
};

export const get_ios_layout = (val?: string): AppLayoutKeyIOS | undefined => {
    switch (val) {
        case `ios0`:
        case `ios1`:
            return val;
        default:
            return undefined;
    };
};

export const get_ios_layout_default = (val?: string): AppLayoutKeyIOS => {
    const res = get_ios_layout(val);
    return res || `ios0`;
};

export const get_web_layout = (val?: string): AppLayoutKeyWeb | undefined => {
    switch (val) {
        case `web_mobile`:
        case `web_desktop`:
            return val;
        default:
            return undefined;
    };
};

export const get_web_layout_default = (val?: string): AppLayoutKeyWeb => {
    const res = get_web_layout(val);
    return res || `web_desktop`;
};


export const get_web_pwa_layout = (val?: string): AppLayoutKeyWebPwa | undefined => {
    switch (val) {
        case `web_ios0`:
        case `web_ios1`:
        case `web0`:
            return val;
        default:
            return undefined;
    };
};

export const get_web_pwa_layout_default = (val?: string): AppLayoutKeyWebPwa => {
    const res = get_web_pwa_layout(val);
    return res || `web0`;
};

export const parse_layer = (layer?: number, layer_default?: ThemeLayer): ThemeLayer => {
    switch (layer) {
        case 0:
        case 1:
        case 2:
            return layer;
        default:
            return layer_default ? layer_default : 0;
    };
};

export const value_constrain = (regex_charset: RegExp, value: string): string => {
    return value
        .split(``)
        .filter((char) => regex_charset.test(char))
        .join(``);
};

export const value_constrain_textarea = (regex_charset: RegExp, value: string): string => {
    return value
        .replace(/\u00A0/g, ` `)
        .split(/[\n]/)
        .map(line => line
            .split(``)
            .filter((char) => regex_charset.test(char))
            .join(``)
        )
        .join("\n");
};

export const encode_query_params = (params_list: NavigationParamTuple[] = []): string => {
    let query = "";
    for (const [k, v] of params_list) {
        if (k && v) {
            if (query) query += `&`;
            query += `${k.trim()}=${encodeURIComponent(v.trim())}`;
        }
    }
    return query ? `?${query}` : ``;
};

export const encode_route = <T extends string>(route: T, params_list?: NavigationParamTuple[]): string => {
    const query = encode_query_params(params_list);
    if (!query) return route;
    return `${route === `/` ? `/` : route.replace(/\/+$/, ``)}${query}`;
};

export const fmt_trellis = (hide_border_t: boolean, hide_border_b: boolean): string => {
    return `${hide_border_t ? `group-first:border-t-0` : `group-first:border-t-line`} ${hide_border_b ? `group-last:border-b-0` : `group-last:border-b-line`}`;
};

export const get_label_classes_kind = (layer: ThemeLayer, label_kind: LabelFieldKind | undefined, hide_active: boolean): string => {
    return `text-layer-${layer}-glyph${label_kind ? `-${label_kind}` : ``} ${hide_active ? `` : `group-active:text-layer-${layer}-glyph${label_kind ? `-${label_kind}_a` : `_a`}`}`
};

export const fmt_textarea_value = (value: string): string => {
    return value.replace(/ /g, `\u00A0`);
};

export const list_assign = (list_curr: string[], list_new: string[]): string[] => {
    return Array.from(
        new Set([...list_curr, ...list_new]),
    ).filter((i) => !!i);
};
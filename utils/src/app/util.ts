import { sleep, type AppLayoutKey, type AppLayoutKeyIOS, type AppLayoutKeyWeb, type LabelFieldKind, type NavigationParamTuple, type ThemeLayer } from "$root";

export const fmt_cl = (classes?: string): string => {
    return classes ? classes : ``;
};

export const get_layout = (val?: string): AppLayoutKey | undefined => {
    const lo_ios = get_ios_layout(val);
    if (lo_ios) return lo_ios;
    const lo_web = get_web_layout(val);
    if (lo_web) return lo_web;
    return undefined;
};

export const get_layout_default = (val?: string): AppLayoutKey => {
    const res = get_layout(val);
    return res || `webm0`;
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
        case `webm0`:
        case `webm1`:
            return val;
        default:
            return undefined;
    };
};

export const get_web_layout_default = (val?: string): AppLayoutKeyWeb => {
    const res = get_web_layout(val);
    return res || `webm0`;
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

export const encode_query_params = <T extends string>(params_list: NavigationParamTuple<T>[] = []): string => {
    let query = "";
    for (const [k, v] of params_list) {
        if (k && v) {
            if (query) query += `&`;
            query += `${k.trim()}=${encodeURIComponent(v.trim())}`;
        }
    }
    return query ? `?${query}` : ``;
};

export const encode_route = <T extends string>(route: T, params_list?: NavigationParamTuple<T>[]): string => {
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

export const el_id = (id: string): HTMLElement | undefined => {
    const el = document.getElementById(id);
    return el ? el : undefined;
};

export const el_toggle = (id: string, toggle_class: string): void => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle(toggle_class);
};

export const els_id_pref = (id_pref: string): Element[] | undefined => {
    const els = document.querySelectorAll(`[id^="${id_pref}"]`);
    if (els && els.length) return Array.from(els);
    return undefined;
};

export const els_id_pref_index = (id_pref: string, num_index: number, orientation: `greater` | `lesser` | `not` = `greater`, inclusive: boolean = true): Element[] | undefined => {
    const els = document.querySelectorAll(`[id^="${`${id_pref}-`.replaceAll(`--`, `-`)}"]`);
    if (els && els.length) return Array.from(els).filter(el => {
        const match = el.id.match(/(?<=^|\-)[0-9]\d*(?=\-)/)
        if (match) {
            const num = parseInt(match[0], 10);
            switch (orientation) {
                case `greater`: {
                    if (inclusive) return num >= num_index;
                    else return num > num_index;
                }
                case `lesser`: {
                    if (inclusive) return num <= num_index;
                    else return num < num_index;
                }
                case `not`: {
                    return num !== num_index;
                }
            }
        }
        return false;
    });
    return undefined;
};

export const el_focus = async (id: string, callback: () => Promise<void>, layer: ThemeLayer = 1): Promise<void> => {
    const el = el_id(id);
    el?.classList.add(`entry-layer-${layer}-highlight`);
    el?.focus();
    await sleep(1200);
    await callback();
    el?.classList.remove(`entry-layer-${layer}-highlight`);
};

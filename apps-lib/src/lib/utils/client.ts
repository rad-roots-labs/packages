import { goto } from "$app/navigation";
import { app_toast, locale, nav_prev, TOAST_MS, type AnchorRoute, type AppConfigType, type AppLayoutKey, type CallbackPromise, type CallbackPromiseGeneric, type GeolocationLatitudeFmtOption, type GlyphKey, type IToast, type LabelFieldKind, type NavigationParamTuple, type NavigationRoute, type NavigationRouteParamKey } from "$lib";
import type { ColorMode, ThemeKey, ThemeLayer } from "@radroots/theme";

import { get as get_store } from "svelte/store";


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

export const get_label_classes = (layer: ThemeLayer, label_kind: LabelFieldKind | undefined, hide_active: boolean): string => {
    return `text-layer-${layer}-glyph${label_kind ? `-${label_kind}` : ``} ${hide_active ? `` : `group-active:text-layer-${layer}-glyph${label_kind ? `-${label_kind}_a` : `_a`}`}`
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

export const fmt_trellis = (hide_border_t: boolean, hide_border_b: boolean): string => {
    return `${hide_border_t ? `group-first:border-t-0` : `group-first:border-t-line`} ${hide_border_b ? `group-last:border-b-0` : `group-last:border-b-line`}`;
};

export const encode_qp = (params_list?: NavigationParamTuple[]): string => {
    const params = (params_list || []).filter(i => i[0] && i[1])
    if (!params.length) return ``;
    return params.map(([k, v], index) => `${index === 0 ? `?` : ``}&${k.trim()}=${encodeURI(v.trim())}`).join(``).trim();
};

export const encode_qp_route = (route: NavigationRoute, params_list?: NavigationParamTuple[]): string => {
    return `${route}/${encode_qp(params_list)}`.replaceAll(`//`, `/`)
};

export const decode_qp = (query_param: string): AnchorRoute => {
    const route = decodeURI(query_param).replaceAll(`//`, `/`);
    return `/${route.charAt(0) === `/` ? route.slice(1) : route}`;
};

export function parse_qp(param: string): NavigationRouteParamKey | undefined {
    switch (param) {
        case "nostr_pk":
        case "id":
        case "rkey":
        case "lat":
        case "lng":
            return param;
        default:
            return undefined;
    };
};

export function time_now_ms(): number {
    return Math.floor(new Date().getTime() / 1000);
};

export const fmt_id = (id?: string): string => {
    const pref = location.pathname.slice(1, -1).replaceAll(`-`, `_`).replaceAll(`/`, `-`).replaceAll(`--`, `-`);
    return `${pref}${id ? `-${id}` : ``}`
};

export const fmt_capitalize = (val: string): string => {
    const fmt = val.split(` `).map(i => `${i.charAt(0).toUpperCase()}${i.slice(1)}`).join(` `);
    return fmt;
};

export const zoom_step = (num: number, op: `inc` | `dec`): number => {
    const int_num = Math.round(num);
    if (op === 'inc') return Math.min(int_num + 1, 14);
    return Math.max(int_num - 1, 0);
};

export const int_step = (num: number, op: `+` | `-`, bounds?: number): number => {
    const int_num = Math.round(num);
    if (op === '+') return Math.min(int_num + 1, bounds || Number.POSITIVE_INFINITY);
    return Math.max(int_num - 1, bounds || 0);
};

export const clipboard_copy = async (text: string, callback?: CallbackPromiseGeneric<string>): Promise<void> => {
    try {
        navigator.clipboard.writeText(text).then(async () => {
            if (callback) await callback(text);
        });
    } catch (e) {
        console.log(`(error) clipboard_copy `, e);
    }
};

export const as_glyph_key = (val: string): GlyphKey => {
    return val as GlyphKey;
}

export const route = async (route: NavigationRoute, params_list?: NavigationParamTuple[]): Promise<void> => {
    try {
        if (params_list && params_list.length) await goto(encode_qp_route(route, params_list));
        else await goto(route);
    } catch (e) {
        console.log(`(error) route `, e);
    }
}

//export const route_sync = (route: NavigationRoute): void => {
//    goto(route);
//};

export const get_layout = (val: string | false): AppLayoutKey => {
    switch (val) {
        case `mobile_base`:
        case `mobile_y`:
            return val;
        default:
            return `mobile_base`;
    };
};

export const view_effect = <T extends string>(view: T): void => {
    for (const el of document.querySelectorAll(`[data-view]`))
        el.classList.toggle(
            `hidden`,
            el.getAttribute(`data-view`) !== view,
        );
};


export const init_toast = (): void => {
    app_toast.set(false);
};

export const show_toast = async (opts: {
    args: IToast | string;
    callback?: CallbackPromise;
}): Promise<void> => {
    try {
        const basis: IToast = typeof opts.args === `string`
            ? {
                layer: 1,
                label: {
                    value: opts.args,
                },
            }
            : opts.args;
        app_toast.set(basis);
        await sleep(TOAST_MS);
        init_toast();
        if (opts.callback) await opts.callback();
    } catch (e) {
        console.log(`(error) show_toast `, e);
    }
};

export const value_constrain = (regex_charset: RegExp, value: string): string => {
    return value
        .split("")
        .filter((char) => regex_charset.test(char))
        .join("");
};

export const parse_cfg_type = (value?: string): AppConfigType => {
    switch (value) {
        case `farmer`:
        case `personal`:
            return value;
        default:
            return `personal`
    };
};

export const route_prev = async (route_fallback: NavigationRoute = `/`, params_fallback: NavigationParamTuple[] = []): Promise<void> => {
    try {
        let route_to = encode_qp_route(route_fallback, params_fallback);
        const $nav_prev = get_store(nav_prev);
        if ($nav_prev.length) {
            const nav_prev_li = $nav_prev.pop();
            if (nav_prev_li)
                route_to = encode_qp_route(
                    nav_prev_li.route,
                    nav_prev_li.params,
                );
        }
        await goto(route_to);
    } catch (e) {
        console.log(`(error) route_prev `, e);
    }
};

export const fmt_geol_latitude = (lat: number, fmt_opt: GeolocationLatitudeFmtOption): string => {
    const _locale = get_store(locale);
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const fmt_deg = new Intl.NumberFormat(_locale, { maximumFractionDigits: 0 });
    const fmt_min = new Intl.NumberFormat(_locale, options);
    const fmt_sec = new Intl.NumberFormat(_locale, options);
    if (fmt_opt === 'dms') {
        const deg = Math.floor(Math.abs(lat));
        const min = Math.floor((Math.abs(lat) - deg) * 60);
        const sec = ((Math.abs(lat) - deg - min / 60) * 3600);
        return `${fmt_deg.format(deg)}° ${fmt_min.format(min)}' ${fmt_sec.format(sec)}" ${lat >= 0 ? 'N' : 'S'}`;
    } else if (fmt_opt === 'dm') {
        const deg = Math.floor(Math.abs(lat));
        const min = (Math.abs(lat) - deg) * 60;
        return `${fmt_deg.format(deg)}° ${fmt_min.format(min)}' ${lat >= 0 ? 'N' : 'S'}`;
    } else {
        return `${lat.toLocaleString(_locale, { maximumFractionDigits: 5 })}° ${lat >= 0 ? 'N' : 'S'}`;
    }
};

export const fmt_geol_longitude = (lng: number, fmt_opt: GeolocationLatitudeFmtOption): string => {
    const _locale = get_store(locale);
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const fmt_deg = new Intl.NumberFormat(_locale, { maximumFractionDigits: 0 });
    const fmt_min = new Intl.NumberFormat(_locale, options);
    const fmt_sec = new Intl.NumberFormat(_locale, options);
    if (fmt_opt === 'dms') {
        const degrees = Math.floor(Math.abs(lng));
        const minutes = Math.floor((Math.abs(lng) - degrees) * 60);
        const seconds = ((Math.abs(lng) - degrees - minutes / 60) * 3600);
        return `${fmt_deg.format(degrees)}° ${fmt_min.format(minutes)}' ${fmt_sec.format(seconds)}" ${lng >= 0 ? 'E' : 'W'}`;
    } else if (fmt_opt === 'dm') {
        const degrees = Math.floor(Math.abs(lng));
        const minutes = (Math.abs(lng) - degrees) * 60;
        return `${fmt_deg.format(degrees)}° ${fmt_min.format(minutes)}' ${lng >= 0 ? 'E' : 'W'}`;
    } else {
        return `${lng.toLocaleString(_locale, { maximumFractionDigits: 5 })}° ${lng >= 0 ? 'E' : 'W'}`;
    }
};

export const exe_iter = async (callback: CallbackPromise, num: number = 1, delay: number = 400): Promise<void> => {
    try {
        const iter_fn = (count: number) => {
            if (count > 0) {
                callback();
                if (count > 1) {
                    setTimeout(() => {
                        iter_fn(count - 1);
                    }, delay);
                }
            }
        };
        iter_fn(num);
    } catch (e) {
        console.log(`(error) exe_iter `, e);
    }
};

import { page } from "$app/stores";
import type { CallbackPromise, NavigationParamTuple } from "$lib";
import type { ColorMode, ThemeKey, ThemeLayer } from "@radroots/theme";
import { get } from "svelte/store";

export const get_store = get;

export const sleep = async (ms: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};

export const theme_set = (theme_key: ThemeKey, color_mode: ColorMode): void => {
    const data_theme = `${theme_key}_${color_mode}`;
    document.documentElement.setAttribute("data-theme", data_theme);
};

export const fmt_id = (id?: string): string => {
    const pref = location.pathname.slice(1, -1).replaceAll(`-`, `_`).replaceAll(`/`, `-`).replaceAll(`--`, `-`);
    return `*${pref}${id ? `-${id}` : ``}`
};

export const fmt_cl = (classes?: string): string => {
    return classes ? classes : ``;
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

export const encode_qp = (params_list?: NavigationParamTuple[]): string => {
    const params = (params_list || []).filter(i => i[0] && i[1])
    if (!params.length) return ``;
    return params.map(([k, v], index) => `${index === 0 ? `?` : ``}&${k.trim()}=${encodeURI(v.trim())}`).join(``).trim();
};

export const encode_qp_route = <T extends string>(route: T, params_list?: NavigationParamTuple[]): string => {
    return `${route}/${encode_qp(params_list)}`.replaceAll(`//`, `/`)
};

export const catch_err = async (e: unknown, func: string, callback: (opts: {
    name: string;
    message: string;
    stack: string;
    url: string;
    func: string;
}) => Promise<void>): Promise<void> => {
    const $page = get_store(page) as any;
    let name = ``;
    let message = ``;
    let stack = ``;
    let url = ``;
    if (e instanceof Error) {
        name = e.name;
        message = e.message;
        stack = e.stack;
        url = $page.url.pathname;
    }
    await callback({ name, message, stack, url, func });
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

export const value_constrain = (regex_charset: RegExp, value: string): string => {
    return value
        .split(``)
        .filter((char) => regex_charset.test(char))
        .join(``);
};

import { goto } from "$app/navigation";
import { nav_prev, type AppLayoutKey, type CallbackPromise, type CallbackRoute, type INavigationRoute, type INavigationRoutePreventRoute, type NavigationParamTuple } from "$lib";
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

export const fmt_textarea_value = (value: string): string => {
    return value.replace(/ /g, `\u00A0`);
};

export const route_prev = async (opts: (INavigationRoute | INavigationRoutePreventRoute)): Promise<void> => {
    let route_to = `/`
    if (`prevent_route` in opts && opts.prevent_route) return void await opts.prevent_route();
    else if (`route` in opts) {
        const $nav_prev = get_store(nav_prev);
        console.log(JSON.stringify($nav_prev, null, 4), `$nav_prev`)
        let route_to =
            typeof opts.route === `string`
                ? opts.route
                : encode_qp_route(opts.route[0], opts.route[1]);
        if ($nav_prev.length) {
            const nav_prev_li = $nav_prev[$nav_prev.length - 1];
            console.log(JSON.stringify(nav_prev_li, null, 4), `nav_prev_li`)
            nav_prev.set([...$nav_prev.slice(0, -1)]);
            if (nav_prev_li)
                route_to = encode_qp_route(
                    nav_prev_li.route,
                    nav_prev_li.params,
                );
            console.log(JSON.stringify($nav_prev, null, 4), `$nav_prev`)
        }
    }
    console.log(JSON.stringify(route_to, null, 4), `route_to`)
    await goto(route_to);
};

export const callback_route = async (callback_route: CallbackRoute): Promise<void> => {
    if (`route` in callback_route) {
        if (typeof callback_route.route === `string`) return void await goto(callback_route.route);
        else return void await goto(
            encode_qp_route(
                callback_route.route[0],
                callback_route.route[1],
            ),
        );
    }
    return void await callback_route();
};

export const get_layout = (val: string | false): AppLayoutKey => {
    switch (val) {
        case `mobile_base`:
        case `mobile_y`:
            return val;
        default:
            return `mobile_base`;
    };
};

export const debounce_input = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

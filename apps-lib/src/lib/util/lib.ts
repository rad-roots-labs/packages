import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { win_h, win_w, type CallbackRoute, type NavigationRouteParamKey } from "$root";
import type { ColorMode, ThemeKey } from "@radroots/theme";
import { encode_route, fmt_geometry_point_coords, fmt_price, parse_currency_marker, type GeometryPoint, type IErrorCatchCallback } from "@radroots/util";
import { get } from "svelte/store";

export const get_store = get;

export const theme_set = (theme_key: ThemeKey, color_mode: ColorMode): void => {
    const data_theme = `${theme_key}_${color_mode}`;
    document.documentElement.setAttribute("data-theme", data_theme);
};

export const fmt_id = (id?: string): string => {
    if (!browser) return ``;
    const pref = location?.pathname.slice(1, -1).replaceAll(`-`, `_`).replaceAll(`/`, `-`).replaceAll(`--`, `-`);
    return `*${pref}${id ? `-${id}` : ``}`
};

export const catch_err = async (e: unknown, func: string, callback: (opts: IErrorCatchCallback) => Promise<void>): Promise<void> => {
    let name = ``;
    let message = ``;
    let stack = ``;
    let url = ``;
    if (e instanceof Error) {
        name = e.name;
        message = e.message;
        stack = e.stack || ``;
        url = page.url.pathname;
    }
    await callback({ name, message, stack, url, func });
};

export const handle_err = async (e: unknown, fcall: string): Promise<void> => {
    try {
        return void await catch_err(e, fcall, async (opts) => {
            console.log(`handle_err e `, e)
            console.log(JSON.stringify(opts, null, 4), `handle_err opts`)
        });
    } catch (e) {
        console.log(`(handle_err) `, e)
    }
};

export const callback_route = async <T extends string>(callback_route: CallbackRoute<T>): Promise<void> => {
    if (`route` in callback_route) {
        if (typeof callback_route.route === `string`) return void await goto(callback_route.route);
        else return void await goto(
            encode_route<string, NavigationRouteParamKey>(
                callback_route.route[0],
                callback_route.route[1],
            ),
        );
    }
    return void await callback_route();
};

export const query_params_clear = async (): Promise<void> => {
    page.url && await goto(page.url.pathname, { replaceState: true })
};

export const lib_fmt_price = (locale: string, value: string, currency: string): string => {
    return fmt_price(locale, value, currency);
};

export const lib_parse_currency_marker = (locale: string, currency: string): string => {
    return parse_currency_marker(locale, currency);
};

export const lib_fmt_geometry_point_coords = (locale: string, point: GeometryPoint): string => {
    return fmt_geometry_point_coords(point, locale);
};

export const view_effect = <T extends string>(view: T): void => {
    if (!browser) return;
    for (const el of document.querySelectorAll(`[data-view]`)) {
        if (el.getAttribute(`data-view`) !== view) el.classList.add(`hidden`)
        else el.classList.remove(`hidden`)
    }
};

export const window_set = (): void => {
    if (!browser) return;
    win_h.set(window.innerHeight);
    win_w.set(window.innerWidth);
};
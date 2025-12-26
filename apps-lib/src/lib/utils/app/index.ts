import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { win_h, win_w } from '$lib/stores/app';
import type { CallbackRoute, NavigationParamTuple, NavigationRouteParamKey, NavigationRouteParamTuple, } from '$lib/types/lib';
import type { ThemeLayer, ThemeMode } from '@radroots/themes';
import type { WebFilePath } from '@radroots/utils';
import { getContext, setContext } from "svelte";
import { get } from "svelte/store";

export const SYMBOLS = {
    bullet: '•',
    dash: `—`,
    up: `↑`,
    down: `↓`,
    percent: `%`
};

export const get_store = get;

export const get_context = <T>(key: string): T =>
    getContext<T>(key);

export const set_context = <T>(key: string, value: T): T =>
    setContext(key, value);

export const sleep = (ms: number): Promise<void> =>
    new Promise((r) => setTimeout(r, ms));

export const trim_slashes = (path: string): string =>
    path.replace(/^\/+|\/+$/g, '');

export const normalize_path = (path: string): string =>
    path
        .replace(/-/g, '_')
        .replace(/\//g, '-')
        .replace(/-+/g, '-');

export const sanitize_path = (id: string): string =>
    id.replace(/[^A-Za-z0-9_-]+/g, '');

export const fmt_id = (raw_id?: string): string => {
    if (!browser) return '';
    const pathname = window.location.pathname;
    const trimmed = trim_slashes(pathname);
    const prefix = normalize_path(trimmed);
    const suffix = raw_id ? `-${sanitize_path(raw_id)}` : '';
    return `*${prefix}${suffix}`;
};

export const view_effect = <T extends string>(view: T): void => {
    if (!browser) return;
    for (const el of document.querySelectorAll(`[data-view]`)) {
        if (el.getAttribute(`data-view`) !== view) el.classList.add(`hidden`)
        else el.classList.remove(`hidden`)
    }
};

export const el_id = (id: string): HTMLElement | undefined => {
    if (!browser) return undefined;
    const el = document.getElementById(id);
    return el ? el : undefined;
};

export const build_storage_key = (
    raw_id: string,
    base_prefix: string
): string =>
    `${fmt_id()}-${sanitize_path(raw_id)}`
        .replace(new RegExp(`^\\*${normalize_path(trim_slashes(base_prefix))}-?`), '*');

export const get_system_theme = (fallback: ThemeMode = "light"): ThemeMode => {
    if (!browser) return fallback;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme_set = (theme_key: string, color_mode: ThemeMode): void => {
    if (!browser) return;
    document.documentElement.setAttribute("data-theme", `${theme_key}_${color_mode}`);
};
export const fmt_cl = (classes?: string): string => `${classes || ``}`;

export const handle_err = async (e: unknown, fcall: string): Promise<void> => {
    try {
        console.log(`[handle_err] `, e, fcall)
        /*return void await catch_err(e, fcall, async (opts) => {
            console.log(`handle_err e `, e)
            console.log(JSON.stringify(opts, null, 4), `handle_err opts`)
        });*/
    } catch (e) {
        console.log(`(handle_err) `, e)
    }
};

export const window_set = (): void => {
    if (!browser) return;
    win_h.set(window.innerHeight);
    win_w.set(window.innerWidth);
};

export const parse_layer = (layer?: number, layer_default?: ThemeLayer): ThemeLayer => {
    switch (layer) {
        case 0:
        case 1:
        case 2:
            return layer;
        default:
            return layer_default ?? 0;
    };
};

export const value_constrain = (regex_charset: RegExp, value: string): string => {
    return value
        .split(``)
        .filter((char) => regex_charset.test(char))
        .join(``);
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

export const encode_route = <TRoute extends string, TParam extends string>(route: TRoute, params_list?: NavigationParamTuple<TParam>[]): string => {
    const query = encode_query_params(params_list);
    if (!query) return route;
    return `${route === `/` ? `/` : route.replace(/\/+$/, ``)}${query}`;
};

export const debounce = <TArgs extends readonly unknown[]>(
    fn: (...args: TArgs) => void,
    delay: number
): ((...args: TArgs) => void) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return (...args: TArgs) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

export const create_router = <T extends string>(): ((nav_route: T, params?: NavigationRouteParamTuple[]) => Promise<void>) => {
    const router = async (nav_route: T, params: NavigationRouteParamTuple[] = []): Promise<void> => {
        try {
            if (params.length) await goto(encode_route<T, NavigationRouteParamKey>(nav_route, params));
            else await goto(nav_route);
        } catch (e) {
            handle_err(e, `route`);
        };
    };
    return router;
};

export const get_locale = (locales: string[]): string => {
    if (!browser) return (locales[0] ?? `en`).toLowerCase();
    const { language: navigator_locale } = navigator;
    let locale = `en`;
    if (locales.some(i => i === navigator_locale.toLowerCase())) locale = navigator.language;
    else if (locales.some(i => i === navigator_locale.slice(0, 2).toLowerCase())) locale = navigator_locale.slice(0, 2);
    return locale.toLowerCase();
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

export const to_arr_buf = (u8: Uint8Array): ArrayBuffer => {
    if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength && u8.buffer instanceof ArrayBuffer) return u8.buffer;
    if (u8.buffer instanceof ArrayBuffer) return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
    const copy = new Uint8Array(u8.byteLength);
    copy.set(u8);
    return copy.buffer;
};

export const parse_file_path = (file_path: string): WebFilePath | undefined => {
    if (file_path.startsWith("blob:")) return { blob_path: file_path, blob_name: file_path.replaceAll("blob:", "").replaceAll("http://", "") };
    const file_path_spl = file_path.split(`/`);
    const file_path_file = file_path_spl[file_path_spl.length - 1] || ``;
    const [file_name, mime_type] = file_path_file.split(`.`);
    if (!file_name || !mime_type) return undefined;
    return {
        file_path,
        file_name,
        mime_type
    };
};

export const download_json = <T>(data: T, filename: string): void => {
    if (!browser) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
};

export const select_file = async (): Promise<File | undefined> => {
    if (!browser) return undefined;
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*/*";
        input.style.display = "none";
        const cleanup = () => {
            input.remove();
        };
        input.addEventListener("change", async () => {
            const file = input.files?.[0];
            cleanup();
            resolve(file ?? undefined);
        });
        document.body.appendChild(input);
        input.click();
    });
};

export const get_file_text = async (file: File | null): Promise<string | undefined> => {
    if (!file) return undefined;
    const text = await file.text();
    return text;
};

export type ParseJsonResult = { ok: true; value: unknown } | { ok: false; error: Error };

export const parse_file_json = async (file: File | null): Promise<ParseJsonResult> => {
    const contents = await get_file_text(file);
    if (!contents) return { ok: false, error: new Error("empty_file") };
    try {
        const parsed: unknown = JSON.parse(contents);
        return { ok: true, value: parsed };
    } catch (error) {
        const err = error instanceof Error ? error : new Error("invalid_json");
        return { ok: false, error: err };
    }
};

import { browser } from '$app/environment';
import type { ThemeMode } from '$lib/types/lib';
import { get } from "svelte/store";

export const get_store = get;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

export const build_storage_key = (
    raw_id: string,
    base_prefix: string
): string =>
    `${fmt_id()}-${sanitize_path(raw_id)}`
        .replace(new RegExp(`^\\*${normalize_path(trim_slashes(base_prefix))}-?`), '*');

export const get_system_theme = (): ThemeMode => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme_set = (theme_key: string, color_mode: ThemeMode): void => {
    document.documentElement.setAttribute("data-theme", `${theme_key}_${color_mode}`);
};
export const fmt_cl = (classes?: string): string => `${classes || ``}`;
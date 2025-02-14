import type { AppLayoutKey } from "$root";

type ConfigWindow = {
    layout: Record<AppLayoutKey, {
        h: number;
        w?: number;
    }>;
    debounce: {
        search: number;
    }
};

export const cfg_app: ConfigWindow = {
    layout: {
        ios0: {
            h: 600,
            w: 300,
        },
        ios1: {
            h: 750,
            w: 350,
        },
        web0: {
            h: 600,
            w: 300,
        },
        web_ios0: {
            h: 600,
            w: 300,
        },
        web_ios1: {
            h: 750,
            w: 800,
        },
        web_mobile: {
            h: 600,
            w: 300,
        },
        web_desktop: {
            h: 600,
            w: 300,
        }
    },
    debounce: {
        search: 200
    },
};
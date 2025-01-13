import { type AppLayoutKey } from "$lib";

export const ascii = {
    bullet: '•',
    dash: `—`,
    up: `↑`,
    down: `↓`
}

type ConfigWindow = {
    layout: Record<AppLayoutKey, {
        h: number;
    }>;
    debounce: {
        search: number;
    }
};

export const cfg_app: ConfigWindow = {
    layout: {
        mobile_base: {
            h: 600
        },
        mobile_y: {
            h: 750
        }
    },
    debounce: {
        search: 200
    },
};

export const cfg_map = {
    styles: {
        base: {
            light: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`,
            dark: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
        }
    },
    popup: {
        dot: {
            offset: [0, -10] as [number, number]
        }
    },
    coords: {
        default: {
            lat: 0,
            lng: 0,
        }
    }
};
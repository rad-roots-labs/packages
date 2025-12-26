export const CFG_MAP = {
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

export const focus_map_marker = (): void => {
    const el = document.querySelector(".maplibregl-marker");
    if (el instanceof HTMLElement) el.click();
};

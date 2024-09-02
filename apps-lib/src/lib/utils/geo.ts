export const fmt_geo_direction = (opts: { lat: number } | { lng: number }): string => {
    if ('lat' in opts) {
        const lat = opts.lat;
        const direction = lat >= 0 ? 'N' : 'S';
        return `° ${direction}`;
    } else {
        const lng = opts.lng;
        const direction = lng >= 0 ? 'E' : 'W';
        return `° ${direction}`;
    }
};


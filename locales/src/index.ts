import iso3166_2 from "./data/iso3166_2.json" assert { type: "json" };
import iso639_1 from "./data/iso639_1.json" assert { type: "json" };
import locales from "./data/locales.json" assert { type: "json" };
export { iso3166_2, iso639_1, locales };

export const locales_default = [`en`] as const;
export type Locales = typeof locales_default[number];
export const locales_set = new Set<string>(locales_default);

export const get_locales_undef = (val?: string): Locales | undefined => {
    switch (val) {
        case `en`:
            return val;
        default:
            return undefined;
    }
};

export const get_locales = (val?: string, fallback?: Locales): Locales => {
    const loc = get_locales_undef(val);
    return loc || fallback || `en`;
};

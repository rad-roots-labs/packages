import type { GeocoderReverseResult } from "./types";

export const parse_geocode_reverse_result = (obj: any): GeocoderReverseResult | undefined => {
    if (typeof obj !== 'object' || !obj) return undefined;
    const { id, name, admin1_id, admin1_name, country_id, country_name, latitude, longitude } = obj;
    if (typeof id !== "number" ||
        typeof name !== "string" || !name ||
        typeof admin1_id !== "number" ||
        typeof admin1_name !== "string" || !admin1_name ||
        typeof country_id !== "string" || !country_id ||
        typeof country_name !== "string" || !country_name ||
        typeof latitude !== "number" ||
        typeof longitude !== "number") {
        return undefined;
    }
    return {
        id,
        name,
        admin1_id,
        admin1_name,
        country_id,
        country_name,
        latitude,
        longitude
    };
};

import type { GeocoderReverseResult } from "./types";

export const parse_geocode_reverse_result = (obj: any): GeocoderReverseResult | undefined => {
    if (typeof obj !== 'object' || !obj) return undefined;
    const { id, name, admin1_id, admin1_name, country_id, country_name, latitude, longitude } = obj;
    if (
        typeof id !== `number` ||
        typeof name !== `string` ||
        typeof admin1_id !== `string` ||
        typeof admin1_name !== `string` ||
        typeof country_id !== `string` ||
        typeof country_name !== `string` ||
        typeof latitude !== `number` ||
        typeof longitude !== `number`
    ) {
        return undefined;
    }
    const result: GeocoderReverseResult = {
        id,
        name,
        admin1_id,
        admin1_name,
        country_id,
        country_name,
        latitude,
        longitude
    };
    return result;
};

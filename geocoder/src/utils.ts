import type { GeolocationCoordinatesPoint } from "@radroots/utils";
import type { GeocoderReverseResult, IGeocoderCountryListResult } from "./types";

export const parse_geocode_reverse_result = (obj: any): GeocoderReverseResult | undefined => {
    if (typeof obj !== `object` || !obj) return undefined;
    const { id, name, admin1_id, admin1_name, country_id, country_name, latitude, longitude } = obj;
    if (
        typeof id === `number` &&
        typeof name === `string` &&
        (typeof admin1_id === `string` || typeof admin1_id === `number`) &&
        typeof admin1_name === `string` &&
        typeof country_id === `string` &&
        typeof country_name === `string` &&
        typeof latitude === `number` &&
        typeof longitude === `number`
    ) {
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
    }
    return undefined;
};

export const parse_geocode_country_list_result = (obj: any): IGeocoderCountryListResult | undefined => {
    if (typeof obj !== `object` || !obj) return undefined;
    const { country_id, country_name: country, latitude_c: lat, longitude_c: lng } = obj;
    if (
        typeof country_id === `string` &&
        typeof country === `string` &&
        typeof lat === `number` &&
        typeof lng === `number`
    ) {
        return {
            country_id,
            country,
            lat,
            lng
        };
    }
    return undefined;
};

export const parse_geocode_country_center_result = (obj: any): GeolocationCoordinatesPoint | undefined => {
    if (typeof obj !== `object` || !obj) return undefined;
    const { latitude_c: lat, longitude_c: lng } = obj;
    if (
        typeof lat === `number` &&
        typeof lng === `number`
    ) {
        return {
            lat,
            lng
        };
    }
    return undefined;
};
import type { GeolocationPoint } from "@radroots/geo";
import { parse_route_path, resolve_route_path } from "@radroots/utils";
import type { GeocoderReverseResult, IGeocoderCountryListResult } from "./types.js";

export const DEFAULT_GEOCODER_DATABASE_FILE = `geonames.db`;
export const DEFAULT_GEOCODER_DATABASE_PATH = `/geonames/geonames.db`;
const GEOCODER_DATABASE_FILE_EXTS = [`.db`];

export type GeocoderDatabaseRoute = {
    base_path: string;
    file_name: string | null;
    query: string;
    hash: string;
};

const is_geocoder_database_file = (segment: string): boolean => {
    const lower_segment = segment.toLowerCase();
    return GEOCODER_DATABASE_FILE_EXTS.some((ext) => lower_segment.endsWith(ext));
};

export const parse_geocoder_database_route = (database_path: string): GeocoderDatabaseRoute => {
    const { path, query, hash } = parse_route_path(database_path);
    const trimmed_path = path.endsWith(`/`) ? path.slice(0, -1) : path;
    const last_slash = trimmed_path.lastIndexOf(`/`);
    const last_segment = last_slash >= 0 ? trimmed_path.slice(last_slash + 1) : trimmed_path;
    const file_name = is_geocoder_database_file(last_segment) ? last_segment : null;
    const base_path = file_name && last_slash >= 0 ? trimmed_path.slice(0, last_slash) : trimmed_path;
    return { base_path, file_name, query, hash };
};

export const resolve_geocoder_database_path = (database_path?: string): string =>
    resolve_route_path(
        database_path,
        DEFAULT_GEOCODER_DATABASE_FILE,
        DEFAULT_GEOCODER_DATABASE_PATH,
        GEOCODER_DATABASE_FILE_EXTS
    );

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

export const parse_geocode_country_center_result = (obj: any): GeolocationPoint | undefined => {
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

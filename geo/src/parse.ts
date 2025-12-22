import type {
    GeocoderReverseResult,
    GeolocationAddress,
    GeolocationPoint,
    GeolocationPointTuple,
    GeometryPoint,
    LocationBasis,
} from "./types.js";

export const parse_geop_point = (point: GeolocationPoint): GeolocationPoint => {
    const { lat, lng } = point;
    return { lat, lng };
};

export const parse_geol_coords = (number: number): number => {
    return Math.round(number * 1e7) / 1e7;
};

export const parse_geolocation_address = (
    addr?: GeolocationAddress
): GeolocationAddress | undefined => {
    if (!addr) return undefined;
    const { primary, admin, country } = addr;
    return { primary, admin, country };
};

export const parse_geolocation_point = (
    point?: GeometryPoint
): GeolocationPoint | undefined => {
    if (!point) return undefined;
    return {
        lat: point.coordinates[1],
        lng: point.coordinates[0],
    };
};

export const geo_point_to_geometry = (
    point?: GeolocationPoint
): GeometryPoint | undefined => {
    if (!point) return undefined;
    return {
        type: "Point",
        coordinates: [point.lng, point.lat],
    };
};

export const location_basis_to_geo_point = (
    basis?: LocationBasis
): GeolocationPoint | undefined => {
    if (!basis) return undefined;
    return {
        lat: basis.point.lat,
        lng: basis.point.lng,
    };
};

export const parse_geocode_address = (
    geoc?: GeocoderReverseResult
): GeolocationAddress | undefined => {
    if (!geoc) return undefined;
    const { name: primary, admin1_name: admin, country_id: country } = geoc;
    return { primary, admin, country };
};

export const parse_geom_point_tup = (
    point: GeometryPoint
): GeolocationPointTuple => {
    return [point.coordinates[0], point.coordinates[1]];
};

export const parse_geol_point_tup = (
    point: GeolocationPoint
): GeolocationPointTuple => {
    return [point.lng, point.lat];
};

export const parse_tup_geop_point = (
    map_center: GeolocationPointTuple
): GeolocationPoint => {
    return {
        lat: map_center[1],
        lng: map_center[0],
    };
};

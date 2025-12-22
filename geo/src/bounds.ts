import type { GeolocationPoint } from "./types.js";

const EARTH_RADIUS = 6371;

export const compute_bounding_box = (
    lat: number,
    lng: number,
    distance_km: number
): {
    nw: GeolocationPoint;
    ne: GeolocationPoint;
    se: GeolocationPoint;
    sw: GeolocationPoint;
} => {
    const deg_to_rad = (deg: number) => deg * (Math.PI / 180);
    const rad_to_deg = (rad: number) => rad * (180 / Math.PI);

    function destination_point(
        lat: number,
        lng: number,
        bearing: number,
        distance_km: number
    ): GeolocationPoint {
        const lat1 = deg_to_rad(lat);
        const lon1 = deg_to_rad(lng);
        const angular_distance = distance_km / EARTH_RADIUS;

        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(angular_distance)
                + Math.cos(lat1)
                * Math.sin(angular_distance)
                * Math.cos(deg_to_rad(bearing))
        );
        const lon2 = lon1
            + Math.atan2(
                Math.sin(deg_to_rad(bearing))
                    * Math.sin(angular_distance)
                    * Math.cos(lat1),
                Math.cos(angular_distance) - Math.sin(lat1) * Math.sin(lat2)
            );

        return { lat: rad_to_deg(lat2), lng: rad_to_deg(lon2) };
    }

    const bearings = [0, 90, 180, 270];

    const coords = bearings.map((bearing) =>
        destination_point(lat, lng, bearing, distance_km / Math.sqrt(2))
    );

    return {
        nw: coords[0],
        ne: coords[1],
        se: coords[2],
        sw: coords[3],
    };
};

export const geo_bounds_calc = (
    lat: number,
    lng: number,
    distance_km: number
): {
    north: GeolocationPoint;
    south: GeolocationPoint;
    east: GeolocationPoint;
    west: GeolocationPoint;
} => {
    const deg_to_rad = (deg: number) => deg * (Math.PI / 180);
    const rad_to_deg = (rad: number) => rad * (180 / Math.PI);

    function destination_point(
        lat: number,
        lng: number,
        bearing: number,
        distance_km: number
    ): GeolocationPoint {
        const lat1 = deg_to_rad(lat);
        const lon1 = deg_to_rad(lng);
        const angular_distance = distance_km / EARTH_RADIUS;

        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(angular_distance)
                + Math.cos(lat1)
                * Math.sin(angular_distance)
                * Math.cos(deg_to_rad(bearing))
        );
        const lon2 = lon1
            + Math.atan2(
                Math.sin(deg_to_rad(bearing))
                    * Math.sin(angular_distance)
                    * Math.cos(lat1),
                Math.cos(angular_distance) - Math.sin(lat1) * Math.sin(lat2)
            );

        return { lat: rad_to_deg(lat2), lng: rad_to_deg(lon2) };
    }

    return {
        north: destination_point(lat, lng, 0, distance_km),
        south: destination_point(lat, lng, 180, distance_km),
        east: destination_point(lat, lng, 90, distance_km),
        west: destination_point(lat, lng, 270, distance_km),
    };
};

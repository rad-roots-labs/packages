export type GeometryPoint = {
    type: string;
    coordinates: number[];
};

export type GeometryPolygon = {
    type: string;
    coordinates: number[][][];
};

export type GeolocationPointTuple = [number, number];

export type GeolocationAddress = {
    primary: string;
    admin: string;
    country: string;
};

export type GeolocationPoint = {
    lat: number;
    lng: number;
};

export type LocationPoint = GeolocationPoint & {
    error: GeolocationPoint;
};

export type GeocoderReverseResult = {
    id: number;
    name: string;
    admin1_id: string | number;
    admin1_name: string;
    country_id: string;
    country_name: string;
    latitude: number;
    longitude: number;
};

export type IClientGeolocationPosition = GeolocationPoint & {
    accuracy?: number;
    altitude?: number;
    altitude_accuracy?: number;
};

export type GeolocationLatitudeFmtOption = "dms" | "d" | "dm";

export type LocationBasis = {
    id: string;
    point: GeolocationPoint;
    address?: GeolocationAddress;
};

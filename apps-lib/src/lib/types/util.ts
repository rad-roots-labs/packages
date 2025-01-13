import { type CallbackPromiseFull } from "$lib";

export type GeolocationLatitudeFmtOption = 'dms' | 'd' | 'dm';

export type GeolocationPoint = {
    lat: number;
    lng: number;
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

export type ILcGeocodeCallback = CallbackPromiseFull<
    GeolocationPoint,
    GeocoderReverseResult | undefined
>
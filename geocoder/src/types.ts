import type { ErrorMessage, GeolocationCoordinatesPoint, ResultObj, ResultsList } from "@radroots/utils";

export type GeocoderErrorMessage =
    | `*-result`
    | `*-statement`
    | `*-db`
    | `*`

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

export type GeocoderDegreeOffset = 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3

export type IGeocoderReverse = {
    point: GeolocationCoordinatesPoint;
    degree_offset?: GeocoderDegreeOffset;
    limit?: number | false;
};

export type IGeocoderCountryCenter = {
    country_id: string;
};

export type IGeocoderCountryListResult = GeolocationCoordinatesPoint & { country_id: string; country: string };

export type IGeocoder = {
    connect(): Promise<true | ErrorMessage<GeocoderErrorMessage>>;
    reverse(opts: IGeocoderReverse): Promise<ResultsList<GeocoderReverseResult> | ErrorMessage<GeocoderErrorMessage>>;
    country(opts: IGeocoderCountryCenter): Promise<ResultsList<GeocoderReverseResult> | ErrorMessage<GeocoderErrorMessage>>;
    country_list(): Promise<ResultsList<IGeocoderCountryListResult> | ErrorMessage<GeocoderErrorMessage>>;
    country_center(opts: IGeocoderCountryCenter): Promise<ResultObj<GeolocationCoordinatesPoint> | ErrorMessage<GeocoderErrorMessage>>
}
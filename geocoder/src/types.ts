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

export type IGeocoderReverseOpts = {
    degree_offset?: GeocoderDegreeOffset;
    limit?: number | false;
};

export type IGeocoderCountryCenter = {
    country_id: string;
};

export type IGeocoderCountryListResult = GeolocationCoordinatesPoint & { country_id: string; country: string };

export type IGeocoderConnectResolve = true | ErrorMessage<GeocoderErrorMessage>;
export type IGeocoderReverseResolve = ResultsList<GeocoderReverseResult> | ErrorMessage<GeocoderErrorMessage>;
export type IGeocoderCountryResolve = ResultsList<GeocoderReverseResult> | ErrorMessage<GeocoderErrorMessage>;
export type IGeocoderCountryListResolve = ResultsList<IGeocoderCountryListResult> | ErrorMessage<GeocoderErrorMessage>;
export type IGeocoderCountryCenterResolve = ResultObj<GeolocationCoordinatesPoint> | ErrorMessage<GeocoderErrorMessage>;

export type IGeocoder = {
    connect(): Promise<IGeocoderConnectResolve>;
    reverse(point: GeolocationCoordinatesPoint, opts?: IGeocoderReverseOpts): Promise<IGeocoderReverseResolve>;
    country(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryResolve>;
    country_list(): Promise<IGeocoderCountryListResolve>;
    country_center(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryCenterResolve>;
}
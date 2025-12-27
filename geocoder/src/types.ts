import { IError } from "@radroots/types-bindings";
import type { GeolocationPoint } from "@radroots/geo";
import type { ResultObj, ResultsList } from "@radroots/utils";

export type GeocoderIError =
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

export type GeocoderConfig = {
    database_path?: string;
};

export type GeocoderConnectConfig = GeocoderConfig & {
    wasm_path?: string;
};

export type IGeocoderReverseOpts = {
    degree_offset?: GeocoderDegreeOffset;
    limit?: number | false;
};

export type IGeocoderCountryCenter = {
    country_id: string;
};

export type IGeocoderCountryListResult = GeolocationPoint & { country_id: string; country: string };

export type IGeocoderConnectResolve = true | IError<GeocoderIError>;
export type IGeocoderReverseResolve = ResultsList<GeocoderReverseResult> | IError<GeocoderIError>;
export type IGeocoderCountryResolve = ResultsList<GeocoderReverseResult> | IError<GeocoderIError>;
export type IGeocoderCountryListResolve = ResultsList<IGeocoderCountryListResult> | IError<GeocoderIError>;
export type IGeocoderCountryCenterResolve = ResultObj<GeolocationPoint> | IError<GeocoderIError>;

export type IGeocoder = {
    connect(config?: GeocoderConnectConfig | string): Promise<IGeocoderConnectResolve>;
    reverse(point: GeolocationPoint, opts?: IGeocoderReverseOpts): Promise<IGeocoderReverseResolve>;
    country(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryResolve>;
    country_list(): Promise<IGeocoderCountryListResolve>;
    country_center(opts: IGeocoderCountryCenter): Promise<IGeocoderCountryCenterResolve>;
}

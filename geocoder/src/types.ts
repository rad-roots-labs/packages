export type GeocoderErrorMessage =
    | `*-statement`
    | `*`

export type GeocoderReverseResult = {
    id: number;
    name: string;
    admin1_id: number;
    admin1_name: string;
    country_id: string;
    country_name: string;
    latitude: number;
    longitude: number;
};

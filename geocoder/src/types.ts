export type GeocoderErrorMessage =
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

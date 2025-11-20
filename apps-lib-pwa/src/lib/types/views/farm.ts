import type { Farm } from "@radroots/tangle-schema-bindings";
import type { GeocoderReverseResult, GeolocationPoint, LocationBasis } from "@radroots/utils";

export type FarmExtended = {
    farm: Farm;
    location?: LocationBasis;
    lots?: FarmLotBasis[];
};


export type FarmLotBasis = {
    id: string;
    location?: LocationBasis;
};
export type IViewFarmsData = {
    list: FarmExtended[];
};

export type IViewFarmsAddSubmission = {
    farm_name: string;
    farm_area?: number;
    farm_area_unit?: string;
    farm_contact_name?: string;
    geolocation_point: GeolocationPoint;
    geocode_result: GeocoderReverseResult;
};

export type IViewFarmsProductsAddSubmitPayload = {
    product: string;
    process: string;
    description: string;
    price_amount: number;
    price_currency: string;
    price_quantity_unit: string;
    photos: string[];
    quantity_amount: number;
    quantity_unit: string;
    quantity_label: string;
    geolocation_point: GeolocationPoint;
    geocode_result: GeocoderReverseResult;
};
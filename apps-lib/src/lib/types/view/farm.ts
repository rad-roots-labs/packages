import type { FarmBasis, GeocoderReverseResult, GeolocationAddress, GeolocationPoint } from "@radroots/util";

export type IViewFarmsData = {
    list: FarmBasis[];
};

export type IViewFarmsDetailsData = FarmBasis;

export type IViewFarmsProductsAddSubmission = {
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
    geolocation_address: GeolocationAddress;
};

export type IViewFarmsAddSubmission = {
    farm_name: string;
    farm_area?: number;
    farm_area_unit?: string;
    farm_contact_name?: string;
    geolocation_point: GeolocationPoint;
    geocode_result: GeocoderReverseResult;
};


import type { CallbackPromise, GeocoderReverseResult, GeolocationPoint } from "@radroots/utils";
import type { FarmExtended } from "../views/farms/farm";

export type IViewBasis<T extends object> = {
    kv_init_prevent?: boolean;
    on_mount?: CallbackPromise;
    on_destroy?: CallbackPromise;
} & T;

export type IViewHomeData = {};

export type IViewFarmsData = {
    list: FarmExtended[];
};

export type IViewFarmsDetailsData = FarmExtended;

export type IViewFarmsProductsAddData = FarmExtended;

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

export type IViewFarmsAddSubmission = {
    farm_name: string;
    farm_area?: number;
    farm_area_unit?: string;
    farm_contact_name?: string;
    geolocation_point: GeolocationPoint;
    geocode_result: GeocoderReverseResult;
};


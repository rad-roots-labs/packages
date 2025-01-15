import { type CallbackPromise, type CallbackPromiseFull, type CallbackPromiseReturn, type IBasisOpt } from "..";
import type { ModelLocationGcs, ModelNostrProfile, ModelNostrRelay, ModelTradeProduct } from "./model";

export type ViewBasis<T extends object> = {
    kv_init_prevent?: boolean;
    lc_on_mount?: CallbackPromise;
    lc_on_destroy?: CallbackPromise;
    lc_gui_alert?: CallbackPromiseFull<string, boolean>;
    lc_gui_confirm?: CallbackPromiseFull<string, boolean>;
} & T;

export type ViewBasisLoadData<TView extends object, TLoadData extends object> = ViewBasis<TView> & {
    lc_load_data: CallbackPromiseReturn<TLoadData>;
    lc_handle_back?: CallbackPromise;
};

export type IFarmLoadData = IBasisOpt<{
    location_gcs: ModelLocationGcs[];
}>;

export type IFarmViewLoadData = IBasisOpt<{
    location_gcs: ModelLocationGcs;
}>;

export type ISearchLoadData = IBasisOpt<{
    location_gcs: ModelLocationGcs[];
    nostr_profile: ModelNostrProfile[];
    nostr_relay: ModelNostrRelay[];
    trade_product: ModelTradeProduct[];
}>;

export type ISettingsNostrProfileLoadData = IBasisOpt<{
    nostr_profile: ModelNostrProfile;
}>;

export type ISettingsNostrProfileEditLoadData = IBasisOpt<{
    nostr_profile: ModelNostrProfile;
    field_key: string;
    field_val?: string;
}>;


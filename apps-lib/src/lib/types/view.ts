import { type CallbackPromise, type CallbackPromiseFull, type CallbackPromiseReturn, type IBasisOpt } from "..";

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

export type IFarmLoadData<
    TLocationGcs extends object,
> = IBasisOpt<{
    location_gcs: TLocationGcs[];
}>;

export type IFarmViewLoadData<
    TLocationGcs extends object,
> = IBasisOpt<{
    location_gcs: TLocationGcs;
}>;

export type ISearchLoadData<
    TLocationGcs extends object,
    TNostrProfile extends object,
    TNostrRelay extends object,
    TTradeProduct extends object,
> = IBasisOpt<{
    location_gcs: TLocationGcs[];
    nostr_profile: TNostrProfile[];
    nostr_relay: TNostrRelay[];
    trade_product: TTradeProduct[];
}>;

export type ISettingsNostrProfileLoadData<TNostrProfile extends object> = IBasisOpt<{
    nostr_profile: TNostrProfile;
}>;

export type ISettingsNostrProfileEditLoadData<TNostrProfile extends object, TNostrProfileFieldKey extends string> = IBasisOpt<{
    nostr_profile: TNostrProfile;
    field_key: TNostrProfileFieldKey;
    field_val?: string;
}>;
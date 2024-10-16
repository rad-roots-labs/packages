import { type ILocationGcsAdd, type ILocationGcsAddResolve, type ILocationGcsGet, type ILocationGcsGetResolve, type ILocationGcsDelete, type ILocationGcsDeleteResolve, type ILocationGcsUpdate, type ILocationGcsUpdateResolve, type ITradeProductAdd, type ITradeProductAddResolve, type ITradeProductGet, type ITradeProductGetResolve, type ITradeProductDelete, type ITradeProductDeleteResolve, type ITradeProductUpdate, type ITradeProductUpdateResolve, type INostrProfileAdd, type INostrProfileAddResolve, type INostrProfileGet, type INostrProfileGetResolve, type INostrProfileDelete, type INostrProfileDeleteResolve, type INostrProfileUpdate, type INostrProfileUpdateResolve, type INostrRelayAdd, type INostrRelayAddResolve, type INostrRelayGet, type INostrRelayGetResolve, type INostrRelayDelete, type INostrRelayDeleteResolve, type INostrRelayUpdate, type INostrRelayUpdateResolve } from "@radroots/models";

export type IClientDbMessage =
    | string
    | "*-fields"
    | "*-result";

export type IClientDb = {
    location_gcs_add(opts: ILocationGcsAdd): Promise<ILocationGcsAddResolve<IClientDbMessage>>;
    location_gcs_get(opts: ILocationGcsGet): Promise<ILocationGcsGetResolve<IClientDbMessage>>;
    location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve<IClientDbMessage>>;
    location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve<IClientDbMessage>>;
    trade_product_add(opts: ITradeProductAdd): Promise<ITradeProductAddResolve<IClientDbMessage>>;
    trade_product_get(opts: ITradeProductGet): Promise<ITradeProductGetResolve<IClientDbMessage>>;
    trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve<IClientDbMessage>>;
    trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve<IClientDbMessage>>;
    nostr_profile_add(opts: INostrProfileAdd): Promise<INostrProfileAddResolve<IClientDbMessage>>;
    nostr_profile_get(opts: INostrProfileGet): Promise<INostrProfileGetResolve<IClientDbMessage>>;
    nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve<IClientDbMessage>>;
    nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve<IClientDbMessage>>;
    nostr_relay_add(opts: INostrRelayAdd): Promise<INostrRelayAddResolve<IClientDbMessage>>;
    nostr_relay_get(opts: INostrRelayGet): Promise<INostrRelayGetResolve<IClientDbMessage>>;
    nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve<IClientDbMessage>>;
    nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve<IClientDbMessage>>;
};
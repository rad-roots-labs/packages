import type { ILocationGcsAdd, ILocationGcsAddResolve, ILocationGcsDelete, ILocationGcsDeleteResolve, ILocationGcsGet, ILocationGcsGetResolve, ILocationGcsUpdate, ILocationGcsUpdateResolve, IMediaUploadAdd, IMediaUploadAddResolve, IMediaUploadDelete, IMediaUploadDeleteResolve, IMediaUploadGet, IMediaUploadGetResolve, IMediaUploadUpdate, IMediaUploadUpdateResolve, INostrProfileAdd, INostrProfileAddResolve, INostrProfileDelete, INostrProfileDeleteResolve, INostrProfileGet, INostrProfileGetResolve, INostrProfileRelayRelation, INostrProfileRelayRelationResolve, INostrProfileRelayRelationResolveGetAll, INostrProfileUpdate, INostrProfileUpdateResolve, INostrRelayAdd, INostrRelayAddResolve, INostrRelayDelete, INostrRelayDeleteResolve, INostrRelayGet, INostrRelayGetResolve, INostrRelayUpdate, INostrRelayUpdateResolve, ITradeProductAdd, ITradeProductAddResolve, ITradeProductDelete, ITradeProductDeleteResolve, ITradeProductGet, ITradeProductGetResolve, ITradeProductLocationRelation, ITradeProductLocationRelationResolve, ITradeProductLocationRelationResolveGetAll, ITradeProductUpdate, ITradeProductUpdateResolve } from "@radroots/models";

export type IClientDatabaseMessage =
    | string
    | "*-fields"
    | "*-result";

export type IClientDatabase = {
    location_gcs_add(opts: ILocationGcsAdd): Promise<ILocationGcsAddResolve<IClientDatabaseMessage>>;
    location_gcs_get(opts: ILocationGcsGet): Promise<ILocationGcsGetResolve<IClientDatabaseMessage>>;
    location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve<IClientDatabaseMessage>>;
    location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve<IClientDatabaseMessage>>;
    trade_product_add(opts: ITradeProductAdd): Promise<ITradeProductAddResolve<IClientDatabaseMessage>>;
    trade_product_get(opts: ITradeProductGet): Promise<ITradeProductGetResolve<IClientDatabaseMessage>>;
    trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve<IClientDatabaseMessage>>;
    trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve<IClientDatabaseMessage>>;
    nostr_profile_add(opts: INostrProfileAdd): Promise<INostrProfileAddResolve<IClientDatabaseMessage>>;
    nostr_profile_get(opts: INostrProfileGet): Promise<INostrProfileGetResolve<IClientDatabaseMessage>>;
    nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve<IClientDatabaseMessage>>;
    nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve<IClientDatabaseMessage>>;
    nostr_relay_add(opts: INostrRelayAdd): Promise<INostrRelayAddResolve<IClientDatabaseMessage>>;
    nostr_relay_get(opts: INostrRelayGet): Promise<INostrRelayGetResolve<IClientDatabaseMessage>>;
    nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve<IClientDatabaseMessage>>;
    nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve<IClientDatabaseMessage>>;
    media_upload_add(opts: IMediaUploadAdd): Promise<IMediaUploadAddResolve<IClientDatabaseMessage>>;
    media_upload_get(opts: IMediaUploadGet): Promise<IMediaUploadGetResolve<IClientDatabaseMessage>>;
    media_upload_delete(opts: IMediaUploadDelete): Promise<IMediaUploadDeleteResolve<IClientDatabaseMessage>>;
    media_upload_update(opts: IMediaUploadUpdate): Promise<IMediaUploadUpdateResolve<IClientDatabaseMessage>>;
    nostr_profile_relay_set(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayRelationResolve<IClientDatabaseMessage>>;
    nostr_profile_relay_unset(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayRelationResolve<IClientDatabaseMessage>>;
    nostr_profile_relay_get_all(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayRelationResolveGetAll<IClientDatabaseMessage>>;
    trade_product_location_set(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationRelationResolve<IClientDatabaseMessage>>;
    trade_product_location_unset(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationRelationResolve<IClientDatabaseMessage>>;
    trade_product_location_get_all(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationRelationResolveGetAll<IClientDatabaseMessage>>;
};
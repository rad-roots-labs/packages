import { type IFarmCreate, type IFarmCreateResolve, type IFarmDelete, type IFarmDeleteResolve, type IFarmRead, type IFarmReadList, type IFarmReadListResolve, type IFarmReadResolve, type IFarmUpdate, type IFarmUpdateResolve, type ILocationGcsCreate, type ILocationGcsCreateResolve, type ILocationGcsDelete, type ILocationGcsDeleteResolve, type ILocationGcsRead, type ILocationGcsReadList, type ILocationGcsReadListResolve, type ILocationGcsReadResolve, type ILocationGcsUpdate, type ILocationGcsUpdateResolve, type ILogErrorCreate, type ILogErrorCreateResolve, type ILogErrorDelete, type ILogErrorDeleteResolve, type ILogErrorRead, type ILogErrorReadList, type ILogErrorReadListResolve, type ILogErrorReadResolve, type ILogErrorUpdate, type ILogErrorUpdateResolve, type IMediaImageCreate, type IMediaImageCreateResolve, type IMediaImageDelete, type IMediaImageDeleteResolve, type IMediaImageRead, type IMediaImageReadList, type IMediaImageReadListResolve, type IMediaImageReadResolve, type IMediaImageUpdate, type IMediaImageUpdateResolve, type INostrProfileCreate, type INostrProfileCreateResolve, type INostrProfileDelete, type INostrProfileDeleteResolve, type INostrProfileRead, type INostrProfileReadList, type INostrProfileReadListResolve, type INostrProfileReadResolve, type INostrProfileUpdate, type INostrProfileUpdateResolve, type INostrRelayCreate, type INostrRelayCreateResolve, type INostrRelayDelete, type INostrRelayDeleteResolve, type INostrRelayRead, type INostrRelayReadList, type INostrRelayReadListResolve, type INostrRelayReadResolve, type INostrRelayUpdate, type INostrRelayUpdateResolve, type ITradeProductCreate, type ITradeProductCreateResolve, type ITradeProductDelete, type ITradeProductDeleteResolve, type ITradeProductRead, type ITradeProductReadList, type ITradeProductReadListResolve, type ITradeProductReadResolve, type ITradeProductUpdate, type ITradeProductUpdateResolve } from "@radroots/models";

export type IClientTauriDatabaseMessage =
    | string
    | "*-fields"
    | "*-result";

export type IClientTauriDatabase = {
    location_gcs_create(opts: ILocationGcsCreate): Promise<ILocationGcsCreateResolve<IClientTauriDatabaseMessage>>; 
    location_gcs_read(opts: ILocationGcsRead): Promise<ILocationGcsReadResolve<IClientTauriDatabaseMessage>>; 
    location_gcs_read_list(opts: ILocationGcsReadList): Promise<ILocationGcsReadListResolve<IClientTauriDatabaseMessage>>; 
    location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve<IClientTauriDatabaseMessage>>; 
    location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve<IClientTauriDatabaseMessage>>; 
    trade_product_create(opts: ITradeProductCreate): Promise<ITradeProductCreateResolve<IClientTauriDatabaseMessage>>; 
    trade_product_read(opts: ITradeProductRead): Promise<ITradeProductReadResolve<IClientTauriDatabaseMessage>>; 
    trade_product_read_list(opts: ITradeProductReadList): Promise<ITradeProductReadListResolve<IClientTauriDatabaseMessage>>; 
    trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve<IClientTauriDatabaseMessage>>; 
    trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve<IClientTauriDatabaseMessage>>; 
    nostr_profile_create(opts: INostrProfileCreate): Promise<INostrProfileCreateResolve<IClientTauriDatabaseMessage>>; 
    nostr_profile_read(opts: INostrProfileRead): Promise<INostrProfileReadResolve<IClientTauriDatabaseMessage>>; 
    nostr_profile_read_list(opts: INostrProfileReadList): Promise<INostrProfileReadListResolve<IClientTauriDatabaseMessage>>; 
    nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve<IClientTauriDatabaseMessage>>; 
    nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve<IClientTauriDatabaseMessage>>; 
    nostr_relay_create(opts: INostrRelayCreate): Promise<INostrRelayCreateResolve<IClientTauriDatabaseMessage>>; 
    nostr_relay_read(opts: INostrRelayRead): Promise<INostrRelayReadResolve<IClientTauriDatabaseMessage>>; 
    nostr_relay_read_list(opts: INostrRelayReadList): Promise<INostrRelayReadListResolve<IClientTauriDatabaseMessage>>; 
    nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve<IClientTauriDatabaseMessage>>; 
    nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve<IClientTauriDatabaseMessage>>; 
    media_image_create(opts: IMediaImageCreate): Promise<IMediaImageCreateResolve<IClientTauriDatabaseMessage>>; 
    media_image_read(opts: IMediaImageRead): Promise<IMediaImageReadResolve<IClientTauriDatabaseMessage>>; 
    media_image_read_list(opts: IMediaImageReadList): Promise<IMediaImageReadListResolve<IClientTauriDatabaseMessage>>; 
    media_image_delete(opts: IMediaImageDelete): Promise<IMediaImageDeleteResolve<IClientTauriDatabaseMessage>>; 
    media_image_update(opts: IMediaImageUpdate): Promise<IMediaImageUpdateResolve<IClientTauriDatabaseMessage>>; 
    log_error_create(opts: ILogErrorCreate): Promise<ILogErrorCreateResolve<IClientTauriDatabaseMessage>>; 
    log_error_read(opts: ILogErrorRead): Promise<ILogErrorReadResolve<IClientTauriDatabaseMessage>>; 
    log_error_read_list(opts: ILogErrorReadList): Promise<ILogErrorReadListResolve<IClientTauriDatabaseMessage>>; 
    log_error_delete(opts: ILogErrorDelete): Promise<ILogErrorDeleteResolve<IClientTauriDatabaseMessage>>; 
    log_error_update(opts: ILogErrorUpdate): Promise<ILogErrorUpdateResolve<IClientTauriDatabaseMessage>>; 
    farm_create(opts: IFarmCreate): Promise<IFarmCreateResolve<IClientTauriDatabaseMessage>>; 
    farm_read(opts: IFarmRead): Promise<IFarmReadResolve<IClientTauriDatabaseMessage>>; 
    farm_read_list(opts: IFarmReadList): Promise<IFarmReadListResolve<IClientTauriDatabaseMessage>>; 
    farm_delete(opts: IFarmDelete): Promise<IFarmDeleteResolve<IClientTauriDatabaseMessage>>; 
    farm_update(opts: IFarmUpdate): Promise<IFarmUpdateResolve<IClientTauriDatabaseMessage>>; 
}; 
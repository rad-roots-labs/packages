import type {
    IFarmCreate,
    IFarmCreateResolve,
    IFarmDelete,
    IFarmDeleteResolve,
    IFarmFindMany,
    IFarmFindManyResolve,
    IFarmFindOne,
    IFarmFindOneResolve,
    IFarmUpdate,
    IFarmUpdateResolve,
    ILocationGcsCreate,
    ILocationGcsCreateResolve,
    ILocationGcsDelete,
    ILocationGcsDeleteResolve,
    ILocationGcsFindMany,
    ILocationGcsFindManyResolve,
    ILocationGcsFindOne,
    ILocationGcsFindOneResolve,
    ILocationGcsUpdate,
    ILocationGcsUpdateResolve,
    ILogErrorCreate,
    ILogErrorCreateResolve,
    ILogErrorDelete,
    ILogErrorDeleteResolve,
    ILogErrorFindMany,
    ILogErrorFindManyResolve,
    ILogErrorFindOne,
    ILogErrorFindOneResolve,
    ILogErrorUpdate,
    ILogErrorUpdateResolve,
    IMediaImageCreate,
    IMediaImageCreateResolve,
    IMediaImageDelete,
    IMediaImageDeleteResolve,
    IMediaImageFindMany,
    IMediaImageFindManyResolve,
    IMediaImageFindOne,
    IMediaImageFindOneResolve,
    IMediaImageUpdate,
    IMediaImageUpdateResolve,
    INostrProfileCreate,
    INostrProfileCreateResolve,
    INostrProfileDelete,
    INostrProfileDeleteResolve,
    INostrProfileFindMany,
    INostrProfileFindManyResolve,
    INostrProfileFindOne,
    INostrProfileFindOneResolve,
    INostrProfileUpdate,
    INostrProfileUpdateResolve,
    INostrRelayCreate,
    INostrRelayCreateResolve,
    INostrRelayDelete,
    INostrRelayDeleteResolve,
    INostrRelayFindMany,
    INostrRelayFindManyResolve,
    INostrRelayFindOne,
    INostrRelayFindOneResolve,
    INostrRelayUpdate,
    INostrRelayUpdateResolve,
    ITradeProductCreate,
    ITradeProductCreateResolve,
    ITradeProductDelete,
    ITradeProductDeleteResolve,
    ITradeProductFindMany,
    ITradeProductFindManyResolve,
    ITradeProductFindOne,
    ITradeProductFindOneResolve,
    ITradeProductUpdate,
    ITradeProductUpdateResolve,
    IFarmLocationRelation,
    IFarmLocationResolve,
    INostrProfileRelayRelation,
    INostrProfileRelayResolve,
    ITradeProductLocationRelation,
    ITradeProductLocationResolve,
    ITradeProductMediaRelation,
    ITradeProductMediaResolve
} from "@radroots/tangle-schema-bindings";
import { type SqlJsMigrationState } from "../sql/types.js";
import type { IError } from "@radroots/types-bindings";
import type { TangleDatabaseBackup } from "./web.js";

export interface IClientTangleDatabase {
    init(): Promise<void>;
    migration_state(): Promise<SqlJsMigrationState | IError<string>>;
    reset(): Promise<SqlJsMigrationState | IError<string>>;
    reinit(): Promise<SqlJsMigrationState | IError<string>>;
    get_store_key(): string;
    export_backup(): Promise<TangleDatabaseBackup | IError<string>>;
    import_backup(backup: TangleDatabaseBackup): Promise<void | IError<string>>;
    farm_create(opts: IFarmCreate): Promise<IFarmCreateResolve | IError<string>>;
    farm_find_one(opts: IFarmFindOne): Promise<IFarmFindOneResolve | IError<string>>;
    farm_find_many(opts?: IFarmFindMany): Promise<IFarmFindManyResolve | IError<string>>;
    farm_delete(opts: IFarmDelete): Promise<IFarmDeleteResolve | IError<string>>;
    farm_update(opts: IFarmUpdate): Promise<IFarmUpdateResolve | IError<string>>;
    location_gcs_create(opts: ILocationGcsCreate): Promise<ILocationGcsCreateResolve | IError<string>>;
    location_gcs_find_one(opts: ILocationGcsFindOne): Promise<ILocationGcsFindOneResolve | IError<string>>;
    location_gcs_find_many(opts?: ILocationGcsFindMany): Promise<ILocationGcsFindManyResolve | IError<string>>;
    location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve | IError<string>>;
    location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve | IError<string>>;
    log_error_create(opts: ILogErrorCreate): Promise<ILogErrorCreateResolve | IError<string>>;
    log_error_find_one(opts: ILogErrorFindOne): Promise<ILogErrorFindOneResolve | IError<string>>;
    log_error_find_many(opts?: ILogErrorFindMany): Promise<ILogErrorFindManyResolve | IError<string>>;
    log_error_delete(opts: ILogErrorDelete): Promise<ILogErrorDeleteResolve | IError<string>>;
    log_error_update(opts: ILogErrorUpdate): Promise<ILogErrorUpdateResolve | IError<string>>;
    media_image_create(opts: IMediaImageCreate): Promise<IMediaImageCreateResolve | IError<string>>;
    media_image_find_one(opts: IMediaImageFindOne): Promise<IMediaImageFindOneResolve | IError<string>>;
    media_image_find_many(opts?: IMediaImageFindMany): Promise<IMediaImageFindManyResolve | IError<string>>;
    media_image_delete(opts: IMediaImageDelete): Promise<IMediaImageDeleteResolve | IError<string>>;
    media_image_update(opts: IMediaImageUpdate): Promise<IMediaImageUpdateResolve | IError<string>>;
    nostr_profile_create(opts: INostrProfileCreate): Promise<INostrProfileCreateResolve | IError<string>>;
    nostr_profile_find_one(opts: INostrProfileFindOne): Promise<INostrProfileFindOneResolve | IError<string>>;
    nostr_profile_find_many(opts?: INostrProfileFindMany): Promise<INostrProfileFindManyResolve | IError<string>>;
    nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve | IError<string>>;
    nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve | IError<string>>;
    nostr_relay_create(opts: INostrRelayCreate): Promise<INostrRelayCreateResolve | IError<string>>;
    nostr_relay_find_one(opts: INostrRelayFindOne): Promise<INostrRelayFindOneResolve | IError<string>>;
    nostr_relay_find_many(opts?: INostrRelayFindMany): Promise<INostrRelayFindManyResolve | IError<string>>;
    nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve | IError<string>>;
    nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve | IError<string>>;
    trade_product_create(opts: ITradeProductCreate): Promise<ITradeProductCreateResolve | IError<string>>;
    trade_product_find_one(opts: ITradeProductFindOne): Promise<ITradeProductFindOneResolve | IError<string>>;
    trade_product_find_many(opts?: ITradeProductFindMany): Promise<ITradeProductFindManyResolve | IError<string>>;
    trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve | IError<string>>;
    trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve | IError<string>>;
    farm_location_set(opts: IFarmLocationRelation): Promise<IFarmLocationResolve | IError<string>>;
    farm_location_unset(opts: IFarmLocationRelation): Promise<IFarmLocationResolve | IError<string>>;
    nostr_profile_relay_set(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve | IError<string>>;
    nostr_profile_relay_unset(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve | IError<string>>;
    trade_product_location_set(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve | IError<string>>;
    trade_product_location_unset(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve | IError<string>>;
    trade_product_media_set(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve | IError<string>>;
    trade_product_media_unset(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve | IError<string>>;
}

export interface IWebTangleDatabase extends IClientTangleDatabase {
}

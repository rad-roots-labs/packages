import type {
    IFarmCreate,
    IFarmCreateResolve,
    IFarmDelete,
    IFarmDeleteResolve,
    IFarmFindMany,
    IFarmFindManyResolve,
    IFarmFindOne,
    IFarmFindOneResolve,
    IFarmLocationRelation,
    IFarmLocationResolve,
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
    INostrProfileRelayRelation,
    INostrProfileRelayResolve,
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
    ITradeProductLocationRelation,
    ITradeProductLocationResolve,
    ITradeProductMediaRelation,
    ITradeProductMediaResolve,
    ITradeProductUpdate,
    ITradeProductUpdateResolve
} from "@radroots/tangle-schema-bindings";
import init_wasm, {
    query_sql,
    tangle_db_export_backup,
    tangle_db_farm_create,
    tangle_db_farm_delete,
    tangle_db_farm_find_many,
    tangle_db_farm_find_one,
    tangle_db_farm_location_set,
    tangle_db_farm_location_unset,
    tangle_db_farm_update,
    tangle_db_import_backup,
    tangle_db_location_gcs_create,
    tangle_db_location_gcs_delete,
    tangle_db_location_gcs_find_many,
    tangle_db_location_gcs_find_one,
    tangle_db_location_gcs_update,
    tangle_db_log_error_create,
    tangle_db_log_error_delete,
    tangle_db_log_error_find_many,
    tangle_db_log_error_find_one,
    tangle_db_log_error_update,
    tangle_db_media_image_create,
    tangle_db_media_image_delete,
    tangle_db_media_image_find_many,
    tangle_db_media_image_find_one,
    tangle_db_media_image_update,
    tangle_db_nostr_profile_create,
    tangle_db_nostr_profile_delete,
    tangle_db_nostr_profile_find_many,
    tangle_db_nostr_profile_find_one,
    tangle_db_nostr_profile_relay_set,
    tangle_db_nostr_profile_relay_unset,
    tangle_db_nostr_profile_update,
    tangle_db_nostr_relay_create,
    tangle_db_nostr_relay_delete,
    tangle_db_nostr_relay_find_many,
    tangle_db_nostr_relay_find_one,
    tangle_db_nostr_relay_update,
    tangle_db_reset_database,
    tangle_db_run_migrations,
    tangle_db_trade_product_create,
    tangle_db_trade_product_delete,
    tangle_db_trade_product_find_many,
    tangle_db_trade_product_find_one,
    tangle_db_trade_product_location_set,
    tangle_db_trade_product_location_unset,
    tangle_db_trade_product_media_set,
    tangle_db_trade_product_media_unset,
    tangle_db_trade_product_update
} from "@radroots/tangle-sql-wasm";
import type { IError } from "@radroots/types-bindings";
import { err_msg, handle_err, type IdbClientConfig } from "@radroots/utils";
import type { SqlJsMigrationRow, SqlJsMigrationState, WebSqlEngineConfig } from "../sql/types.js";
import { WebSqlEngine } from "../sql/web.js";
import { radroots_sql_install_bridges } from "./bridge.js";
import { cl_tangle_error } from "./error.js";
import type { IWebTangleDatabase } from "./types.js";

export type TangleDatabaseBackup = {
    format_version: string;
    tangle_sql_version: string;
    schema: {
        object_type: string;
        name: string;
        table_name?: string;
        sql?: string;
    }[];
    data: {
        name: string;
        rows: Record<string, unknown>[];
    }[];
    migrations: {
        name: string;
        up_sql: string;
        down_sql: string;
    }[];
};

export type WebTangleDatabaseConfig = {
    store_key?: string;
    idb_config?: IdbClientConfig;
    cipher_config?: IdbClientConfig | null;
};

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_sql_migration_row = (value: unknown): value is SqlJsMigrationRow => {
    if (!is_record(value)) return false;
    return typeof value.id === "number"
        && Number.isFinite(value.id)
        && typeof value.name === "string"
        && typeof value.applied_at === "string";
};

const is_sql_migration_row_list = (value: unknown): value is SqlJsMigrationRow[] =>
    Array.isArray(value) && value.every(is_sql_migration_row);

const is_backup_schema_entry = (value: unknown): value is TangleDatabaseBackup["schema"][number] => {
    if (!is_record(value)) return false;
    if (typeof value.object_type !== "string") return false;
    if (typeof value.name !== "string") return false;
    if ("table_name" in value && typeof value.table_name !== "undefined" && typeof value.table_name !== "string") return false;
    if ("sql" in value && typeof value.sql !== "undefined" && typeof value.sql !== "string") return false;
    return true;
};

const is_backup_data_entry = (value: unknown): value is TangleDatabaseBackup["data"][number] => {
    if (!is_record(value)) return false;
    if (typeof value.name !== "string") return false;
    if (!Array.isArray(value.rows)) return false;
    if (!value.rows.every(is_record)) return false;
    return true;
};

const is_backup_migration_entry = (value: unknown): value is TangleDatabaseBackup["migrations"][number] => {
    if (!is_record(value)) return false;
    return typeof value.name === "string"
        && typeof value.up_sql === "string"
        && typeof value.down_sql === "string";
};

const is_tangle_database_backup = (value: unknown): value is TangleDatabaseBackup => {
    if (!is_record(value)) return false;
    if (typeof value.format_version !== "string") return false;
    if (typeof value.tangle_sql_version !== "string") return false;
    if (!Array.isArray(value.schema) || !value.schema.every(is_backup_schema_entry)) return false;
    if (!Array.isArray(value.data) || !value.data.every(is_backup_data_entry)) return false;
    if (!Array.isArray(value.migrations) || !value.migrations.every(is_backup_migration_entry)) return false;
    return true;
};

const DEFAULT_TANGLE_STORE_KEY = "radroots-pwa-v1-tangle-db";
const DEFAULT_TANGLE_IDB_CONFIG: IdbClientConfig = {
    database: "radroots-pwa-v1-tangle",
    store: "default"
};

export class WebTangleDatabase implements IWebTangleDatabase {
    private engine: WebSqlEngine | null = null;
    private readonly store_key: string;
    private readonly idb_config: IdbClientConfig;
    private readonly cipher_config: IdbClientConfig | null;

    constructor(config?: WebTangleDatabaseConfig) {
        this.store_key = config?.store_key ?? DEFAULT_TANGLE_STORE_KEY;
        this.idb_config = config?.idb_config ?? DEFAULT_TANGLE_IDB_CONFIG;
        this.cipher_config = config?.cipher_config ?? null;
    }

    get_store_key(): string {
        return this.store_key;
    }

    private serialize<T>(opts: T): string {
        return JSON.stringify(opts);
    }

    private deserialize<T>(data: string): T | IError<string> {
        try {
            return JSON.parse(data);
        } catch {
            return err_msg(cl_tangle_error.parse_failure);
        }
    }

    private get_engine_config(): WebSqlEngineConfig {
        return {
            store_key: this.store_key,
            idb_config: this.idb_config,
            cipher_config: this.cipher_config
        };
    }

    async init(): Promise<void> {
        if (this.engine) return;
        await init_wasm();
        this.engine = await WebSqlEngine.create(this.get_engine_config());
        radroots_sql_install_bridges(this.engine);
        tangle_db_run_migrations();
    }

    async migration_state(): Promise<SqlJsMigrationState | IError<string>> {
        try {
            const res = await query_sql("select id, name, applied_at from __migrations order by id asc", "[]");
            let parsed: unknown = res;
            if (typeof res === "string") {
                try {
                    parsed = JSON.parse(res);
                } catch {
                    return err_msg(cl_tangle_error.parse_failure);
                }
            }
            if (!is_sql_migration_row_list(parsed)) return err_msg(cl_tangle_error.invalid_response);
            const names = parsed.map((row) => row.name);
            return { applied_names: names, applied_count: names.length };
        } catch (e) {
            return handle_err(e);
        }
    }

    async reset(): Promise<SqlJsMigrationState | IError<string>> {
        tangle_db_reset_database();
        tangle_db_run_migrations();
        return this.migration_state();
    }

    async reinit(): Promise<SqlJsMigrationState | IError<string>> {
        if (this.engine) {
            await this.engine.purge_storage();
            await this.engine.close();
        }
        this.engine = await WebSqlEngine.create(this.get_engine_config());
        radroots_sql_install_bridges(this.engine);
        tangle_db_run_migrations();
        return this.migration_state();
    }

    async export_backup(): Promise<TangleDatabaseBackup | IError<string>> {
        try {
            await this.init();
            const res = await tangle_db_export_backup();
            let parsed: unknown = res;
            if (typeof res === "string") {
                try {
                    parsed = JSON.parse(res);
                } catch {
                    return err_msg(cl_tangle_error.parse_failure);
                }
            }
            if (!is_tangle_database_backup(parsed)) return err_msg(cl_tangle_error.invalid_response);
            return parsed;
        } catch (e) {
            return handle_err(e);
        }
    }

    async import_backup(backup: TangleDatabaseBackup): Promise<void | IError<string>> {
        try {
            await this.init();
            tangle_db_import_backup(this.serialize(backup));
            return;
        } catch (e) {
            return handle_err(e);
        }
    }

    async farm_create(opts: IFarmCreate): Promise<IFarmCreateResolve | IError<string>> {
        const res = await tangle_db_farm_create(this.serialize(opts));
        return this.deserialize<IFarmCreateResolve>(res);
    }

    async farm_find_one(opts: IFarmFindOne): Promise<IFarmFindOneResolve | IError<string>> {
        const res = await tangle_db_farm_find_one(this.serialize(opts));
        return this.deserialize<IFarmFindOneResolve>(res);
    }

    async farm_find_many(opts?: IFarmFindMany): Promise<IFarmFindManyResolve | IError<string>> {
        const res = await tangle_db_farm_find_many(this.serialize(opts ?? {}));
        return this.deserialize<IFarmFindManyResolve>(res);
    }

    async farm_delete(opts: IFarmDelete): Promise<IFarmDeleteResolve | IError<string>> {
        const res = await tangle_db_farm_delete(this.serialize(opts));
        return this.deserialize<IFarmDeleteResolve>(res);
    }

    async farm_update(opts: IFarmUpdate): Promise<IFarmUpdateResolve | IError<string>> {
        const res = await tangle_db_farm_update(this.serialize(opts));
        return this.deserialize<IFarmUpdateResolve>(res);
    }

    async location_gcs_create(opts: ILocationGcsCreate): Promise<ILocationGcsCreateResolve | IError<string>> {
        const res = await tangle_db_location_gcs_create(this.serialize(opts));
        return this.deserialize<ILocationGcsCreateResolve>(res);
    }

    async location_gcs_find_one(opts: ILocationGcsFindOne): Promise<ILocationGcsFindOneResolve | IError<string>> {
        const res = await tangle_db_location_gcs_find_one(this.serialize(opts));
        return this.deserialize<ILocationGcsFindOneResolve>(res);
    }

    async location_gcs_find_many(opts?: ILocationGcsFindMany): Promise<ILocationGcsFindManyResolve | IError<string>> {
        const res = await tangle_db_location_gcs_find_many(this.serialize(opts ?? {}));
        return this.deserialize<ILocationGcsFindManyResolve>(res);
    }

    async location_gcs_delete(opts: ILocationGcsDelete): Promise<ILocationGcsDeleteResolve | IError<string>> {
        const res = await tangle_db_location_gcs_delete(this.serialize(opts));
        return this.deserialize<ILocationGcsDeleteResolve>(res);
    }

    async location_gcs_update(opts: ILocationGcsUpdate): Promise<ILocationGcsUpdateResolve | IError<string>> {
        const res = await tangle_db_location_gcs_update(this.serialize(opts));
        return this.deserialize<ILocationGcsUpdateResolve>(res);
    }

    async log_error_create(opts: ILogErrorCreate): Promise<ILogErrorCreateResolve | IError<string>> {
        const res = await tangle_db_log_error_create(this.serialize(opts));
        return this.deserialize<ILogErrorCreateResolve>(res);
    }

    async log_error_find_one(opts: ILogErrorFindOne): Promise<ILogErrorFindOneResolve | IError<string>> {
        const res = await tangle_db_log_error_find_one(this.serialize(opts));
        return this.deserialize<ILogErrorFindOneResolve>(res);
    }

    async log_error_find_many(opts?: ILogErrorFindMany): Promise<ILogErrorFindManyResolve | IError<string>> {
        const res = await tangle_db_log_error_find_many(this.serialize(opts ?? {}));
        return this.deserialize<ILogErrorFindManyResolve>(res);
    }

    async log_error_delete(opts: ILogErrorDelete): Promise<ILogErrorDeleteResolve | IError<string>> {
        const res = await tangle_db_log_error_delete(this.serialize(opts));
        return this.deserialize<ILogErrorDeleteResolve>(res);
    }

    async log_error_update(opts: ILogErrorUpdate): Promise<ILogErrorUpdateResolve | IError<string>> {
        const res = await tangle_db_log_error_update(this.serialize(opts));
        return this.deserialize<ILogErrorUpdateResolve>(res);
    }

    async media_image_create(opts: IMediaImageCreate): Promise<IMediaImageCreateResolve | IError<string>> {
        const res = await tangle_db_media_image_create(this.serialize(opts));
        return this.deserialize<IMediaImageCreateResolve>(res);
    }

    async media_image_find_one(opts: IMediaImageFindOne): Promise<IMediaImageFindOneResolve | IError<string>> {
        const res = await tangle_db_media_image_find_one(this.serialize(opts));
        return this.deserialize<IMediaImageFindOneResolve>(res);
    }

    async media_image_find_many(opts?: IMediaImageFindMany): Promise<IMediaImageFindManyResolve | IError<string>> {
        const res = await tangle_db_media_image_find_many(this.serialize(opts ?? {}));
        return this.deserialize<IMediaImageFindManyResolve>(res);
    }

    async media_image_delete(opts: IMediaImageDelete): Promise<IMediaImageDeleteResolve | IError<string>> {
        const res = await tangle_db_media_image_delete(this.serialize(opts));
        return this.deserialize<IMediaImageDeleteResolve>(res);
    }

    async media_image_update(opts: IMediaImageUpdate): Promise<IMediaImageUpdateResolve | IError<string>> {
        const res = await tangle_db_media_image_update(this.serialize(opts));
        return this.deserialize<IMediaImageUpdateResolve>(res);
    }

    async nostr_profile_create(opts: INostrProfileCreate): Promise<INostrProfileCreateResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_create(this.serialize(opts));
        return this.deserialize<INostrProfileCreateResolve>(res);
    }

    async nostr_profile_find_one(opts: INostrProfileFindOne): Promise<INostrProfileFindOneResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_find_one(this.serialize(opts));
        return this.deserialize<INostrProfileFindOneResolve>(res);
    }

    async nostr_profile_find_many(opts?: INostrProfileFindMany): Promise<INostrProfileFindManyResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_find_many(this.serialize(opts ?? {}));
        return this.deserialize<INostrProfileFindManyResolve>(res);
    }

    async nostr_profile_delete(opts: INostrProfileDelete): Promise<INostrProfileDeleteResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_delete(this.serialize(opts));
        return this.deserialize<INostrProfileDeleteResolve>(res);
    }

    async nostr_profile_update(opts: INostrProfileUpdate): Promise<INostrProfileUpdateResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_update(this.serialize(opts));
        return this.deserialize<INostrProfileUpdateResolve>(res);
    }

    async nostr_relay_create(opts: INostrRelayCreate): Promise<INostrRelayCreateResolve | IError<string>> {
        const res = await tangle_db_nostr_relay_create(this.serialize(opts));
        return this.deserialize<INostrRelayCreateResolve>(res);
    }

    async nostr_relay_find_one(opts: INostrRelayFindOne): Promise<INostrRelayFindOneResolve | IError<string>> {
        const res = await tangle_db_nostr_relay_find_one(this.serialize(opts));
        return this.deserialize<INostrRelayFindOneResolve>(res);
    }

    async nostr_relay_find_many(opts?: INostrRelayFindMany): Promise<INostrRelayFindManyResolve | IError<string>> {
        const res = await tangle_db_nostr_relay_find_many(this.serialize(opts ?? {}));
        return this.deserialize<INostrRelayFindManyResolve>(res);
    }

    async nostr_relay_delete(opts: INostrRelayDelete): Promise<INostrRelayDeleteResolve | IError<string>> {
        const res = await tangle_db_nostr_relay_delete(this.serialize(opts));
        return this.deserialize<INostrRelayDeleteResolve>(res);
    }

    async nostr_relay_update(opts: INostrRelayUpdate): Promise<INostrRelayUpdateResolve | IError<string>> {
        const res = await tangle_db_nostr_relay_update(this.serialize(opts));
        return this.deserialize<INostrRelayUpdateResolve>(res);
    }

    async trade_product_create(opts: ITradeProductCreate): Promise<ITradeProductCreateResolve | IError<string>> {
        const res = await tangle_db_trade_product_create(this.serialize(opts));
        return this.deserialize<ITradeProductCreateResolve>(res);
    }

    async trade_product_find_one(opts: ITradeProductFindOne): Promise<ITradeProductFindOneResolve | IError<string>> {
        const res = await tangle_db_trade_product_find_one(this.serialize(opts));
        return this.deserialize<ITradeProductFindOneResolve>(res);
    }

    async trade_product_find_many(opts?: ITradeProductFindMany): Promise<ITradeProductFindManyResolve | IError<string>> {
        const res = await tangle_db_trade_product_find_many(this.serialize(opts ?? {}));
        return this.deserialize<ITradeProductFindManyResolve>(res);
    }

    async trade_product_delete(opts: ITradeProductDelete): Promise<ITradeProductDeleteResolve | IError<string>> {
        const res = await tangle_db_trade_product_delete(this.serialize(opts));
        return this.deserialize<ITradeProductDeleteResolve>(res);
    }

    async trade_product_update(opts: ITradeProductUpdate): Promise<ITradeProductUpdateResolve | IError<string>> {
        const res = await tangle_db_trade_product_update(this.serialize(opts));
        return this.deserialize<ITradeProductUpdateResolve>(res);
    }

    async farm_location_set(opts: IFarmLocationRelation): Promise<IFarmLocationResolve | IError<string>> {
        const res = await tangle_db_farm_location_set(this.serialize(opts));
        return this.deserialize<IFarmLocationResolve>(res);
    }

    async farm_location_unset(opts: IFarmLocationRelation): Promise<IFarmLocationResolve | IError<string>> {
        const res = await tangle_db_farm_location_unset(this.serialize(opts));
        return this.deserialize<IFarmLocationResolve>(res);
    }

    async nostr_profile_relay_set(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_relay_set(this.serialize(opts));
        return this.deserialize<INostrProfileRelayResolve>(res);
    }

    async nostr_profile_relay_unset(opts: INostrProfileRelayRelation): Promise<INostrProfileRelayResolve | IError<string>> {
        const res = await tangle_db_nostr_profile_relay_unset(this.serialize(opts));
        return this.deserialize<INostrProfileRelayResolve>(res);
    }

    async trade_product_location_set(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve | IError<string>> {
        const res = await tangle_db_trade_product_location_set(this.serialize(opts));
        return this.deserialize<ITradeProductLocationResolve>(res);
    }

    async trade_product_location_unset(opts: ITradeProductLocationRelation): Promise<ITradeProductLocationResolve | IError<string>> {
        const res = await tangle_db_trade_product_location_unset(this.serialize(opts));
        return this.deserialize<ITradeProductLocationResolve>(res);
    }

    async trade_product_media_set(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve | IError<string>> {
        const res = await tangle_db_trade_product_media_set(this.serialize(opts));
        return this.deserialize<ITradeProductMediaResolve>(res);
    }

    async trade_product_media_unset(opts: ITradeProductMediaRelation): Promise<ITradeProductMediaResolve | IError<string>> {
        const res = await tangle_db_trade_product_media_unset(this.serialize(opts));
        return this.deserialize<ITradeProductMediaResolve>(res);
    }

}

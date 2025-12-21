export * from "./error.js";
export * from "./types.js";
export * from "./codec.js";

import { backup_bundle_decode, backup_bundle_encode } from "./codec.js";
import type {
    BackupBundle,
    BackupBundlePayload,
    BackupDatastoreStore,
    BackupKeystoreStore,
    BackupSqlStore
} from "./types.js";
import type { IWebCryptoService, KeyMaterialProvider } from "../crypto/types.js";
import { DeviceKeyMaterialProvider } from "../crypto/provider.js";
import { handle_err, type ResolveError } from "@radroots/utils";
import type { IError } from "@radroots/types-bindings";

export type BackupBundleBuildOpts = {
    sql_store?: BackupSqlStore;
    keystore_store?: BackupKeystoreStore;
    datastore_store?: BackupDatastoreStore;
    app_version?: string;
    crypto_service?: IWebCryptoService;
    key_material_provider?: KeyMaterialProvider;
};

export type BackupBundleImportOpts = {
    sql_store?: BackupSqlStore;
    keystore_store?: BackupKeystoreStore;
    datastore_store?: BackupDatastoreStore;
    crypto_service?: IWebCryptoService;
    key_material_provider?: KeyMaterialProvider;
    import_registry?: boolean;
};

const is_error = <T>(value: ResolveError<T>): value is IError<string> => {
    return typeof value === "object" && value !== null && "err" in value;
};

const collect_payloads = async (opts: BackupBundleBuildOpts): Promise<ResolveError<BackupBundlePayload[]>> => {
    const payloads: BackupBundlePayload[] = [];
    if (opts.sql_store) {
        const data = await opts.sql_store.export_backup();
        if (is_error(data)) return data;
        payloads.push({
            store_id: opts.sql_store.get_store_id(),
            store_type: "sql",
            data
        });
    }
    if (opts.keystore_store) {
        const data = await opts.keystore_store.export_backup();
        if (is_error(data)) return data;
        payloads.push({
            store_id: opts.keystore_store.get_store_id(),
            store_type: "keystore",
            data
        });
    }
    if (opts.datastore_store) {
        const data = await opts.datastore_store.export_backup();
        if (is_error(data)) return data;
        payloads.push({
            store_id: opts.datastore_store.get_store_id(),
            store_type: "datastore",
            data
        });
    }
    return payloads;
};

export const backup_bundle_build = async (opts: BackupBundleBuildOpts): Promise<ResolveError<BackupBundle>> => {
    const payloads = await collect_payloads(opts);
    if (is_error(payloads)) return payloads;
    const stores = payloads.map((payload) => ({
        store_id: payload.store_id,
        store_type: payload.store_type
    }));
    const crypto_registry = opts.crypto_service
        ? await opts.crypto_service.export_registry()
        : { stores: [], keys: [] };
    return {
        manifest: {
            version: 1,
            created_at: Date.now(),
            app_version: opts.app_version,
            stores,
            crypto_registry
        },
        payloads
    };
};

export const backup_bundle_export = async (opts: BackupBundleBuildOpts): Promise<ResolveError<Uint8Array>> => {
    try {
        const provider = opts.key_material_provider ?? new DeviceKeyMaterialProvider();
        const bundle = await backup_bundle_build(opts);
        if (is_error(bundle)) return bundle;
        return await backup_bundle_encode(bundle, provider);
    } catch (e) {
        return handle_err(e);
    }
};

export const backup_bundle_import = async (blob: Uint8Array, opts: BackupBundleImportOpts): Promise<ResolveError<BackupBundle>> => {
    try {
        const provider = opts.key_material_provider ?? new DeviceKeyMaterialProvider();
        const bundle = await backup_bundle_decode(blob, provider);
        if (opts.import_registry && opts.crypto_service) {
            await opts.crypto_service.import_registry(bundle.manifest.crypto_registry);
        }
        for (const payload of bundle.payloads) {
            if (payload.store_type === "sql" && opts.sql_store) {
                if (opts.sql_store.get_store_id() === payload.store_id) {
                    const res = await opts.sql_store.import_backup(payload.data);
                    if (is_error(res)) return res;
                }
            }
            if (payload.store_type === "keystore" && opts.keystore_store) {
                if (opts.keystore_store.get_store_id() === payload.store_id) {
                    const res = await opts.keystore_store.import_backup(payload.data);
                    if (is_error(res)) return res;
                }
            }
            if (payload.store_type === "datastore" && opts.datastore_store) {
                if (opts.datastore_store.get_store_id() === payload.store_id) {
                    const res = await opts.datastore_store.import_backup(payload.data);
                    if (is_error(res)) return res;
                }
            }
        }
        return bundle;
    } catch (e) {
        return handle_err(e);
    }
};

import { createStore, get as idb_get } from "idb-keyval";
import { as_array_buffer, err_msg, handle_err, type ResolveError } from "@radroots/utils";
import { idb_store_ensure, idb_store_exists } from "../idb/store.js";
import { idb_value_as_bytes } from "../idb/value.js";
import { is_error } from "../utils/resolve.js";
import { cl_crypto_error } from "./error.js";
import { crypto_envelope_decode, crypto_envelope_encode } from "./envelope.js";
import { crypto_kdf_derive_kek, crypto_kdf_iterations_default, crypto_kdf_salt_create } from "./kdf.js";
import { crypto_key_export_raw, crypto_key_generate, crypto_key_id_create, crypto_key_import_raw, crypto_key_unwrap, crypto_key_wrap } from "./keys.js";
import { crypto_registry_export, crypto_registry_get_key_entry, crypto_registry_get_store_index, crypto_registry_import, crypto_registry_set_key_entry, crypto_registry_set_store_index } from "./registry.js";
import { DeviceKeyMaterialProvider } from "./provider.js";
import type { CryptoDecryptOutcome, CryptoKeyEntry, CryptoRegistryExport, CryptoStoreConfig, CryptoStoreIndex, IWebCryptoService, KeyMaterialProvider, LegacyKeyConfig } from "./types.js";

const DEFAULT_IV_LENGTH = 12;

const ensure_crypto = (): ResolveError<void> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) return err_msg(cl_crypto_error.crypto_undefined);
    return;
};

const merge_key_ids = (key_ids: string[], next_key_id: string): string[] => {
    if (key_ids.includes(next_key_id)) return key_ids;
    return [...key_ids, next_key_id];
};

export class WebCryptoService implements IWebCryptoService {
    private store_configs: Map<string, CryptoStoreConfig>;
    private key_material_provider: KeyMaterialProvider;

    constructor(config?: { key_material_provider?: KeyMaterialProvider }) {
        this.store_configs = new Map();
        this.key_material_provider = config?.key_material_provider ?? new DeviceKeyMaterialProvider();
    }

    public register_store_config(config: CryptoStoreConfig): void {
        const existing = this.store_configs.get(config.store_id);
        if (existing) {
            this.store_configs.set(config.store_id, {
                store_id: config.store_id,
                iv_length: config.iv_length ?? existing.iv_length,
                legacy_key: config.legacy_key ?? existing.legacy_key
            });
            return;
        }
        this.store_configs.set(config.store_id, {
            store_id: config.store_id,
            iv_length: config.iv_length ?? DEFAULT_IV_LENGTH,
            legacy_key: config.legacy_key
        });
    }

    public async encrypt(store_id: string, plaintext: Uint8Array): Promise<ResolveError<Uint8Array>> {
        const env_err = ensure_crypto();
        if (env_err) return env_err;
        const resolved = await this.resolve_active_key(store_id);
        if (is_error(resolved)) return resolved;
        const { key, entry } = resolved;
        const iv_length = entry.iv_length || DEFAULT_IV_LENGTH;
        const iv = new Uint8Array(iv_length);
        crypto.getRandomValues(iv);
        try {
            const cipher_buf = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: as_array_buffer(iv)
                },
                key,
                as_array_buffer(plaintext)
            );
            const envelope = {
                version: 1,
                key_id: entry.key_id,
                iv,
                created_at: Date.now(),
                ciphertext: new Uint8Array(cipher_buf)
            };
            return crypto_envelope_encode(envelope);
        } catch {
            return err_msg(cl_crypto_error.encrypt_failure);
        }
    }

    public async decrypt(store_id: string, blob: Uint8Array): Promise<ResolveError<Uint8Array>> {
        const outcome = await this.decrypt_record(store_id, blob);
        if (is_error(outcome)) return outcome;
        return outcome.plaintext;
    }

    public async decrypt_record(store_id: string, blob: Uint8Array): Promise<ResolveError<CryptoDecryptOutcome>> {
        const env_err = ensure_crypto();
        if (env_err) return env_err;
        const config = this.resolve_store_config(store_id);
        let envelope: ReturnType<typeof crypto_envelope_decode>;
        try {
            envelope = crypto_envelope_decode(blob);
        } catch (e) {
            return handle_err(e);
        }
        if (envelope) return await this.decrypt_envelope(store_id, envelope);
        return await this.decrypt_legacy(store_id, blob, config.legacy_key, config.iv_length ?? DEFAULT_IV_LENGTH);
    }

    public async rotate_store_key(store_id: string): Promise<ResolveError<string>> {
        const config = this.resolve_store_config(store_id);
        const index = await crypto_registry_get_store_index(store_id);
        if (is_error(index)) return index;
        if (!index) {
            const created = await this.create_store_key(store_id, config);
            if (is_error(created)) return created;
            return created.entry.key_id;
        }
        const prev_entry = await crypto_registry_get_key_entry(index.active_key_id);
        if (is_error(prev_entry)) return prev_entry;
        if (prev_entry) {
            const rotated_entry: CryptoKeyEntry = {
                ...prev_entry,
                status: "rotated"
            };
            const set_entry = await crypto_registry_set_key_entry(rotated_entry);
            if (is_error(set_entry)) return set_entry;
        }
        const created = await this.create_key_entry(store_id, config);
        if (is_error(created)) return created;
        const next_index: CryptoStoreIndex = {
            ...index,
            active_key_id: created.entry.key_id,
            key_ids: merge_key_ids(index.key_ids, created.entry.key_id)
        };
        const set_index = await crypto_registry_set_store_index(next_index);
        if (is_error(set_index)) return set_index;
        return created.entry.key_id;
    }

    public async export_registry(): Promise<ResolveError<CryptoRegistryExport>> {
        return await crypto_registry_export();
    }

    public async import_registry(registry: CryptoRegistryExport): Promise<ResolveError<void>> {
        return await crypto_registry_import(registry);
    }

    private resolve_store_config(store_id: string): CryptoStoreConfig {
        const existing = this.store_configs.get(store_id);
        if (existing) return existing;
        const config = {
            store_id,
            iv_length: DEFAULT_IV_LENGTH
        };
        this.store_configs.set(store_id, config);
        return config;
    }

    private async resolve_active_key(store_id: string): Promise<ResolveError<{ key: CryptoKey; entry: CryptoKeyEntry; index: CryptoStoreIndex; }>> {
        const index = await crypto_registry_get_store_index(store_id);
        if (is_error(index)) return index;
        if (!index) return await this.create_store_key(store_id, this.resolve_store_config(store_id));
        const entry = await crypto_registry_get_key_entry(index.active_key_id);
        if (is_error(entry)) return entry;
        if (!entry) return await this.create_store_key(store_id, this.resolve_store_config(store_id));
        const key = await this.unwrap_key_entry(entry);
        if (is_error(key)) return key;
        return { key, entry, index };
    }

    private async resolve_key_by_id(store_id: string, key_id: string): Promise<ResolveError<{ key: CryptoKey; entry: CryptoKeyEntry; index: CryptoStoreIndex; }>> {
        const entry = await crypto_registry_get_key_entry(key_id);
        if (is_error(entry)) return entry;
        if (!entry) return err_msg(cl_crypto_error.key_not_found);
        let index = await crypto_registry_get_store_index(store_id);
        if (is_error(index)) return index;
        if (!index) {
            index = {
                store_id,
                active_key_id: entry.key_id,
                key_ids: [entry.key_id],
                created_at: entry.created_at
            };
            const set_index = await crypto_registry_set_store_index(index);
            if (is_error(set_index)) return set_index;
        }
        const key = await this.unwrap_key_entry(entry);
        if (is_error(key)) return key;
        return { key, entry, index };
    }

    private async create_store_key(store_id: string, config: CryptoStoreConfig): Promise<ResolveError<{ key: CryptoKey; entry: CryptoKeyEntry; index: CryptoStoreIndex; }>> {
        const created = await this.create_key_entry(store_id, config);
        if (is_error(created)) return created;
        const index: CryptoStoreIndex = {
            store_id,
            active_key_id: created.entry.key_id,
            key_ids: [created.entry.key_id],
            created_at: created.entry.created_at
        };
        const set_index = await crypto_registry_set_store_index(index);
        if (is_error(set_index)) return set_index;
        return {
            key: created.key,
            entry: created.entry,
            index
        };
    }

    private async create_key_entry(store_id: string, config: CryptoStoreConfig): Promise<ResolveError<{ key: CryptoKey; entry: CryptoKeyEntry; }>> {
        try {
            const key_id = crypto_key_id_create();
            const created_at = Date.now();
            const kdf_salt = crypto_kdf_salt_create();
            const kdf_iterations = crypto_kdf_iterations_default();
            const material = await this.key_material_provider.get_key_material();
            const provider_id = await this.key_material_provider.get_provider_id();
            const kek = await crypto_kdf_derive_kek(material, kdf_salt, kdf_iterations);
            material.fill(0);
            const data_key = await crypto_key_generate();
            const raw_key = await crypto_key_export_raw(data_key);
            const wrapped = await crypto_key_wrap(kek, raw_key);
            const entry: CryptoKeyEntry = {
                key_id,
                store_id,
                created_at,
                status: "active",
                wrapped_key: wrapped.wrapped_key,
                wrap_iv: wrapped.wrap_iv,
                kdf_salt,
                kdf_iterations,
                iv_length: config.iv_length ?? DEFAULT_IV_LENGTH,
                algorithm: "AES-GCM",
                provider_id
            };
            const set_entry = await crypto_registry_set_key_entry(entry);
            if (is_error(set_entry)) return set_entry;
            return { key: data_key, entry };
        } catch (e) {
            return handle_err(e);
        }
    }

    private async unwrap_key_entry(entry: CryptoKeyEntry): Promise<ResolveError<CryptoKey>> {
        try {
            const material = await this.key_material_provider.get_key_material();
            const kek = await crypto_kdf_derive_kek(material, entry.kdf_salt, entry.kdf_iterations);
            material.fill(0);
            return await crypto_key_unwrap(kek, entry.wrapped_key, entry.wrap_iv);
        } catch (e) {
            return handle_err(e);
        }
    }

    private async decrypt_envelope(store_id: string, envelope: { key_id: string; iv: Uint8Array; ciphertext: Uint8Array; }): Promise<ResolveError<CryptoDecryptOutcome>> {
        const resolved = await this.resolve_key_by_id(store_id, envelope.key_id);
        if (is_error(resolved)) return resolved;
        try {
            const plain_buf = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: as_array_buffer(envelope.iv)
                },
                resolved.key,
                as_array_buffer(envelope.ciphertext)
            );
            const plaintext = new Uint8Array(plain_buf);
            const needs_reencrypt = resolved.index.active_key_id !== envelope.key_id;
            if (!needs_reencrypt) return { plaintext, needs_reencrypt };
            const reencrypted = await this.encrypt(store_id, plaintext);
            if (is_error(reencrypted)) return reencrypted;
            return { plaintext, needs_reencrypt, reencrypted };
        } catch {
            return err_msg(cl_crypto_error.decrypt_failure);
        }
    }

    private async decrypt_legacy(
        store_id: string,
        blob: Uint8Array,
        legacy_key: LegacyKeyConfig | undefined,
        iv_length: number
    ): Promise<ResolveError<CryptoDecryptOutcome>> {
        if (!legacy_key) return err_msg(cl_crypto_error.legacy_key_missing);
        const legacy_crypto_key = await this.load_legacy_key(legacy_key);
        if (is_error(legacy_crypto_key)) return legacy_crypto_key;
        if (!legacy_crypto_key) return err_msg(cl_crypto_error.legacy_key_missing);
        if (blob.byteLength <= iv_length) return err_msg(cl_crypto_error.invalid_envelope);
        const iv = blob.subarray(0, iv_length);
        const ciphertext = blob.subarray(iv_length);
        try {
            const plain_buf = await crypto.subtle.decrypt(
                {
                    name: legacy_key.algorithm,
                    iv: as_array_buffer(iv)
                },
                legacy_crypto_key,
                as_array_buffer(ciphertext)
            );
            const plaintext = new Uint8Array(plain_buf);
            const reencrypted = await this.encrypt(store_id, plaintext);
            if (is_error(reencrypted)) return reencrypted;
            return { plaintext, needs_reencrypt: true, reencrypted };
        } catch {
            return err_msg(cl_crypto_error.decrypt_failure);
        }
    }

    private async load_legacy_key(legacy: LegacyKeyConfig): Promise<ResolveError<CryptoKey | null>> {
        if (typeof indexedDB === "undefined") return err_msg(cl_crypto_error.idb_undefined);
        const exists = await idb_store_exists(legacy.idb_config.database, legacy.idb_config.store);
        if (!exists) return null;
        try {
            await idb_store_ensure(legacy.idb_config.database, legacy.idb_config.store);
            const legacy_store = createStore(legacy.idb_config.database, legacy.idb_config.store);
            const stored = await idb_get(legacy.key_name, legacy_store);
            if (!stored) return null;
            if (stored instanceof CryptoKey) return stored;
            const bytes = idb_value_as_bytes(stored);
            if (!bytes) return null;
            return await crypto_key_import_raw(bytes);
        } catch (e) {
            return handle_err(e);
        }
    }
}

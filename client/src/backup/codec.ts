import { as_array_buffer } from "@radroots/utils";
import { cl_backup_error } from "./error.js";
import { crypto_kdf_derive_kek, crypto_kdf_iterations_default, crypto_kdf_salt_create } from "../crypto/kdf.js";
import type { BackupBundle, BackupBundleEnvelope } from "./types.js";
import type { KeyMaterialProvider } from "../crypto/types.js";

const ensure_crypto = (): void => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_backup_error.crypto_undefined);
};

export const backup_bytes_to_b64 = (bytes: Uint8Array): string => {
    if (typeof btoa === "undefined") throw new Error(cl_backup_error.encode_failure);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
};

export const backup_b64_to_bytes = (value: string): Uint8Array => {
    if (typeof atob === "undefined") throw new Error(cl_backup_error.decode_failure);
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
};

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_backup_bundle_envelope = (value: unknown): value is BackupBundleEnvelope => {
    if (!is_record(value)) return false;
    return typeof value.version === "number"
        && typeof value.created_at === "number"
        && typeof value.kdf_salt_b64 === "string"
        && typeof value.kdf_iterations === "number"
        && typeof value.iv_b64 === "string"
        && typeof value.ciphertext_b64 === "string";
};

const is_backup_bundle = (value: unknown): value is BackupBundle => {
    if (!is_record(value)) return false;
    if (!is_record(value.manifest)) return false;
    if (!Array.isArray(value.payloads)) return false;
    return typeof value.manifest.version === "number"
        && typeof value.manifest.created_at === "number"
        && Array.isArray(value.manifest.stores);
};

export const backup_bundle_encode = async (bundle: BackupBundle, provider: KeyMaterialProvider): Promise<Uint8Array> => {
    ensure_crypto();
    try {
        const json = JSON.stringify(bundle);
        const plaintext = new TextEncoder().encode(json);
        const salt = crypto_kdf_salt_create();
        const iterations = crypto_kdf_iterations_default();
        const material = await provider.get_key_material();
        const kek = await crypto_kdf_derive_kek(material, salt, iterations);
        material.fill(0);
        const iv = new Uint8Array(12);
        crypto.getRandomValues(iv);
        const cipher_buf = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: as_array_buffer(iv)
            },
            kek,
            as_array_buffer(plaintext)
        );
        const envelope: BackupBundleEnvelope = {
            version: 1,
            created_at: Date.now(),
            kdf_salt_b64: backup_bytes_to_b64(salt),
            kdf_iterations: iterations,
            iv_b64: backup_bytes_to_b64(iv),
            ciphertext_b64: backup_bytes_to_b64(new Uint8Array(cipher_buf))
        };
        const encoded = JSON.stringify(envelope);
        return new TextEncoder().encode(encoded);
    } catch {
        throw new Error(cl_backup_error.encode_failure);
    }
};

export const backup_bundle_decode = async (blob: Uint8Array, provider: KeyMaterialProvider): Promise<BackupBundle> => {
    ensure_crypto();
    try {
        const json = new TextDecoder().decode(blob);
        const parsed = JSON.parse(json);
        if (!is_backup_bundle_envelope(parsed)) throw new Error(cl_backup_error.invalid_bundle);
        const salt = backup_b64_to_bytes(parsed.kdf_salt_b64);
        const iv = backup_b64_to_bytes(parsed.iv_b64);
        const ciphertext = backup_b64_to_bytes(parsed.ciphertext_b64);
        const material = await provider.get_key_material();
        const kek = await crypto_kdf_derive_kek(material, salt, parsed.kdf_iterations);
        material.fill(0);
        const plain_buf = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: as_array_buffer(iv)
            },
            kek,
            as_array_buffer(ciphertext)
        );
        const plaintext = new TextDecoder().decode(new Uint8Array(plain_buf));
        const bundle_parsed = JSON.parse(plaintext);
        if (!is_backup_bundle(bundle_parsed)) throw new Error(cl_backup_error.invalid_bundle);
        return bundle_parsed;
    } catch {
        throw new Error(cl_backup_error.decode_failure);
    }
};

import { as_array_buffer } from "@radroots/utils";
import { cl_crypto_error } from "./error.js";

const KEY_ID_BYTES_LENGTH = 16;
const WRAP_IV_LENGTH = 12;

const bytes_to_hex = (bytes: Uint8Array): string => {
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
        const part = bytes[i].toString(16).padStart(2, "0");
        out += part;
    }
    return out;
};

export const crypto_key_id_create = (): string => {
    if (!globalThis.crypto) throw new Error(cl_crypto_error.crypto_undefined);
    const bytes = new Uint8Array(KEY_ID_BYTES_LENGTH);
    crypto.getRandomValues(bytes);
    return bytes_to_hex(bytes);
};

export const crypto_key_generate = async (): Promise<CryptoKey> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
};

export const crypto_key_export_raw = async (key: CryptoKey): Promise<Uint8Array> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    const raw = await crypto.subtle.exportKey("raw", key);
    return new Uint8Array(raw);
};

export const crypto_key_import_raw = async (raw: Uint8Array): Promise<CryptoKey> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    return await crypto.subtle.importKey(
        "raw",
        as_array_buffer(raw),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
};

export const crypto_key_wrap = async (
    kek: CryptoKey,
    raw_key: Uint8Array
): Promise<{ wrapped_key: Uint8Array; wrap_iv: Uint8Array; }> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    try {
        const wrap_iv = new Uint8Array(WRAP_IV_LENGTH);
        crypto.getRandomValues(wrap_iv);
        const cipher_buf = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: as_array_buffer(wrap_iv)
            },
            kek,
            as_array_buffer(raw_key)
        );
        const wrapped_key = new Uint8Array(cipher_buf);
        raw_key.fill(0);
        return { wrapped_key, wrap_iv };
    } catch {
        throw new Error(cl_crypto_error.wrap_failure);
    }
};

export const crypto_key_unwrap = async (
    kek: CryptoKey,
    wrapped_key: Uint8Array,
    wrap_iv: Uint8Array
): Promise<CryptoKey> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    try {
        const raw = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: as_array_buffer(wrap_iv)
            },
            kek,
            as_array_buffer(wrapped_key)
        );
        return await crypto_key_import_raw(new Uint8Array(raw));
    } catch {
        throw new Error(cl_crypto_error.unwrap_failure);
    }
};

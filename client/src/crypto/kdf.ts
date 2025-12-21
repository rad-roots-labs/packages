import { cl_crypto_error } from "./error.js";

const DEFAULT_KDF_ITERATIONS = 210000;
const KDF_HASH = "SHA-256";

export const crypto_kdf_iterations_default = (): number => DEFAULT_KDF_ITERATIONS;

export const crypto_kdf_salt_create = (length: number = 16): Uint8Array => {
    if (!globalThis.crypto) throw new Error(cl_crypto_error.crypto_undefined);
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt);
    return salt;
};

export const crypto_kdf_derive_kek = async (
    material: Uint8Array,
    salt: Uint8Array,
    iterations: number
): Promise<CryptoKey> => {
    if (!globalThis.crypto || !globalThis.crypto.subtle) throw new Error(cl_crypto_error.crypto_undefined);
    try {
        const material_bytes = new Uint8Array(material);
        const salt_bytes = new Uint8Array(salt);
        const base_key = await crypto.subtle.importKey("raw", material_bytes, "PBKDF2", false, ["deriveKey"]);
        return await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt_bytes,
                iterations,
                hash: KDF_HASH
            },
            base_key,
            {
                name: "AES-GCM",
                length: 256
            },
            false,
            ["encrypt", "decrypt"]
        );
    } catch {
        throw new Error(cl_crypto_error.kdf_failure);
    }
};

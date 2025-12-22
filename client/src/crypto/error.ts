export const cl_crypto_error = {
    idb_undefined: "error.client.crypto.idb_undefined",
    crypto_undefined: "error.client.crypto.crypto_undefined",
    invalid_envelope: "error.client.crypto.invalid_envelope",
    invalid_key_id: "error.client.crypto.invalid_key_id",
    key_not_found: "error.client.crypto.key_not_found",
    unwrap_failure: "error.client.crypto.unwrap_failure",
    wrap_failure: "error.client.crypto.wrap_failure",
    legacy_key_missing: "error.client.crypto.legacy_key_missing",
    encrypt_failure: "error.client.crypto.encrypt_failure",
    decrypt_failure: "error.client.crypto.decrypt_failure",
    kdf_failure: "error.client.crypto.kdf_failure",
    registry_failure: "error.client.crypto.registry_failure"
} as const;

export type ClientCryptoError = keyof typeof cl_crypto_error;
export type ClientCryptoErrorMessage = (typeof cl_crypto_error)[ClientCryptoError];

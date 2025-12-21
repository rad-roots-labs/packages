export const cl_cipher_error = {
    idb_undefined: "error.client.cipher.idb_undefined",
    crypto_undefined: "error.client.cipher.crypto_undefined",
    invalid_ciphertext: "error.client.cipher.invalid_ciphertext",
    decrypt_failure: "error.client.cipher.decrypt_failure"
} as const;

export type ClientCipherError = keyof typeof cl_cipher_error;
export type ClientCipherErrorMessage = (typeof cl_cipher_error)[ClientCipherError];
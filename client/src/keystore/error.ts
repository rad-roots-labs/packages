export const cl_keystore_error = {
    idb_undefined: "error.client.keystore.idb_undefined",
    missing_key: "error.client.keystore.missing_key",
    corrupt_data: "error.client.keystore.corrupt_data",
    nostr_invalid_secret_key: "error.client.keystore.nostr_invalid_secret_key",
    nostr_no_results: "error.client.keystore.nostr_no_results"
} as const;

export type ClientKeystoreError = keyof typeof cl_keystore_error;
export type ClientKeystoreErrorMessage = (typeof cl_keystore_error)[ClientKeystoreError];

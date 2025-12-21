export const cl_backup_error = {
    crypto_undefined: "error.client.backup.crypto_undefined",
    invalid_bundle: "error.client.backup.invalid_bundle",
    decode_failure: "error.client.backup.decode_failure",
    encode_failure: "error.client.backup.encode_failure",
    provider_missing: "error.client.backup.provider_missing"
} as const;

export type ClientBackupError = keyof typeof cl_backup_error;
export type ClientBackupErrorMessage = (typeof cl_backup_error)[ClientBackupError];

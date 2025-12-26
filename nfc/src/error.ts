export const NFC_ERROR = {
    window_undefined: "error.client.nfc.window_undefined",
    secure_context_required: "error.client.nfc.secure_context_required",
    unsupported: "error.client.nfc.unsupported",
    permission_denied: "error.client.nfc.permission_denied",
    scan_in_progress: "error.client.nfc.scan_in_progress",
    scan_failed: "error.client.nfc.scan_failed",
    read_failed: "error.client.nfc.read_failed",
    write_failed: "error.client.nfc.write_failed",
    make_read_only_failed: "error.client.nfc.make_read_only_failed",
    abort: "error.client.nfc.abort",
    timeout: "error.client.nfc.timeout",
    invalid_message: "error.client.nfc.invalid_message",
    unknown_error: "error.client.nfc.unknown_error"
} as const;

export type NfcError = keyof typeof NFC_ERROR;
export type NfcErrorMessage = (typeof NFC_ERROR)[NfcError];

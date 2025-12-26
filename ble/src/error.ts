export const BLE_ERROR = {
    window_undefined: "error.client.ble.window_undefined",
    navigator_undefined: "error.client.ble.navigator_undefined",
    secure_context_required: "error.client.ble.secure_context_required",
    unsupported: "error.client.ble.unsupported",
    unavailable: "error.client.ble.unavailable",
    permission_denied: "error.client.ble.permission_denied",
    device_not_found: "error.client.ble.device_not_found",
    connect_failed: "error.client.ble.connect_failed",
    service_not_found: "error.client.ble.service_not_found",
    characteristic_not_found: "error.client.ble.characteristic_not_found",
    notify_failed: "error.client.ble.notify_failed",
    write_failed: "error.client.ble.write_failed",
    read_failed: "error.client.ble.read_failed",
    disconnected: "error.client.ble.disconnected",
    abort: "error.client.ble.abort",
    timeout: "error.client.ble.timeout",
    invalid_message: "error.client.ble.invalid_message",
    unknown_error: "error.client.ble.unknown_error"
} as const;

export type BleError = keyof typeof BLE_ERROR;
export type BleErrorMessage = (typeof BLE_ERROR)[BleError];

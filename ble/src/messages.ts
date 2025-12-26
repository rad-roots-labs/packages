import { err_msg, type ResolveErrorMsg } from "@radroots/utils";
import { BLE_ERROR, type BleErrorMessage } from "./error.js";
import type { BleMessageEncoding, BleMessageInput } from "./types.js";

export const ble_message_bytes = (value: BleMessageInput): ResolveErrorMsg<Uint8Array, BleErrorMessage> => {
    if (typeof value === "string") {
        if (typeof TextEncoder === "undefined") return err_msg(BLE_ERROR.invalid_message);
        return new TextEncoder().encode(value);
    }
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    return err_msg(BLE_ERROR.invalid_message);
};

export const ble_message_buffer_source = (bytes: Uint8Array): ArrayBufferView<ArrayBuffer> => {
    if (bytes.buffer instanceof ArrayBuffer) return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    return copy;
};

export const ble_message_text = (bytes: Uint8Array, encoding: BleMessageEncoding = "utf-8"): string | undefined => {
    if (typeof TextDecoder === "undefined") return;
    try {
        return new TextDecoder(encoding).decode(bytes);
    } catch {
        return;
    }
};

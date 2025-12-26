import type { ResolveErrorMsg } from "@radroots/utils";
import type { BleErrorMessage } from "./error.js";

export type BleMessageData = string | ArrayBuffer | ArrayBufferView;

export type BleMessageInput = BleMessageData;

export type BleMessageEncoding = "utf-8";

export type BleMessage = {
    bytes: Uint8Array;
    timestamp_ms: number;
};

export type BleAvailability = {
    supported: boolean;
    secure_context: boolean;
    window_available: boolean;
    navigator_available: boolean;
    bluetooth_available: boolean;
};

export type BleAvailabilityState = BleAvailability & {
    adapter_available: boolean | "unknown";
};

export type BlePermissionState = PermissionState | "unknown";

export type BleServiceProfile = {
    service_uuid: string;
    client_write_uuid: string;
    client_notify_uuid: string;
};

export const BLE_MESSAGE_PROFILE: BleServiceProfile = {
    service_uuid: "7e0b0001-7f62-49e1-9b3f-8e7a2f30a1d1",
    client_write_uuid: "7e0b0002-7f62-49e1-9b3f-8e7a2f30a1d1",
    client_notify_uuid: "7e0b0003-7f62-49e1-9b3f-8e7a2f30a1d1"
};

export type BleDeviceInfo = {
    id: string;
    name?: string;
    connected: boolean;
};

export type BleMessageHandler = (message: BleMessage) => void;
export type BleDisconnectHandler = (reason: BleErrorMessage) => void;

export type BleConnectOptions = {
    signal?: AbortSignal;
    timeout_ms?: number;
    profile?: BleServiceProfile;
    name_prefix?: string;
    accept_all_devices?: boolean;
};

export type BleWriteOptions = {
    signal?: AbortSignal;
    timeout_ms?: number;
    without_response?: boolean;
};

export interface IBleSession {
    get_active(): boolean;
    get_device_info(): BleDeviceInfo;
    send_message(message: BleMessageInput, opts?: BleWriteOptions): Promise<ResolveErrorMsg<void, BleErrorMessage>>;
    disconnect(): Promise<void>;
    set_on_message(handler?: BleMessageHandler): void;
    set_on_disconnect(handler?: BleDisconnectHandler): void;
}

export interface IBle {
    availability(): BleAvailability;
    availability_state(): Promise<BleAvailabilityState>;
    permission_state(): Promise<BlePermissionState>;
    connect(opts?: BleConnectOptions): Promise<ResolveErrorMsg<IBleSession, BleErrorMessage>>;
}

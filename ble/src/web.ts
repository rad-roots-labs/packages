import { err_msg, type ResolveErrorMsg } from "@radroots/utils";
import { BLE_ERROR, type BleErrorMessage } from "./error.js";
import { ble_message_buffer_source, ble_message_bytes } from "./messages.js";
import type {
    BleAvailability,
    BleAvailabilityState,
    BleConnectOptions,
    BleDeviceInfo,
    BleDisconnectHandler,
    BleMessageHandler,
    BleMessageInput,
    BlePermissionState,
    BleServiceProfile,
    BleWriteOptions,
    IBle,
    IBleSession
} from "./types.js";
import { BLE_MESSAGE_PROFILE } from "./types.js";

type BlePermissionName = PermissionName | "bluetooth" | "bluetooth-le";

type BlePermissionDescriptor = {
    name: BlePermissionName;
};

interface PermissionsBle {
    query(permission_desc: BlePermissionDescriptor): Promise<PermissionStatus>;
}

interface NavigatorWithPermissions extends Navigator {
    permissions: PermissionsBle;
}

interface BleBluetooth {
    requestDevice(options: BleRequestDeviceOptions): Promise<BleDevice>;
    getAvailability?(): Promise<boolean>;
}

interface NavigatorWithBluetooth extends Navigator {
    bluetooth: BleBluetooth;
}

type BleRequestDeviceFilter = {
    services?: string[];
    namePrefix?: string;
};

type BleRequestDeviceOptions = {
    filters?: BleRequestDeviceFilter[];
    acceptAllDevices?: boolean;
    optionalServices?: string[];
};

interface BleDevice {
    id: string;
    name?: string;
    gatt?: BleGattServer;
    addEventListener(type: "gattserverdisconnected", listener: () => void, options?: AddEventListenerOptions): void;
    removeEventListener(type: "gattserverdisconnected", listener: () => void, options?: EventListenerOptions): void;
}

interface BleGattServer {
    connect(): Promise<BleGattServer>;
    disconnect(): void;
    getPrimaryService(uuid: string): Promise<BleGattService>;
    connected: boolean;
    device: BleDevice;
}

interface BleGattService {
    getCharacteristic(uuid: string): Promise<BleGattCharacteristic>;
}

interface BleGattCharacteristic {
    startNotifications(): Promise<BleGattCharacteristic>;
    stopNotifications?(): Promise<void>;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithoutResponse?(value: BufferSource): Promise<void>;
    value?: DataView | null;
    addEventListener(type: "characteristicvaluechanged", listener: (event: Event) => void, options?: AddEventListenerOptions): void;
    removeEventListener(type: "characteristicvaluechanged", listener: (event: Event) => void): void;
}

type BleWaitResult<T> = { value: T } | { timeout: true };

const has_permissions_api = (nav: Navigator): nav is NavigatorWithPermissions => "permissions" in nav;

const has_bluetooth = (nav: Navigator): nav is NavigatorWithBluetooth => "bluetooth" in nav;

const read_permission_state = async (nav: Navigator): Promise<BlePermissionState> => {
    if (!has_permissions_api(nav)) return "unknown";
    try {
        const status = await nav.permissions.query({ name: "bluetooth" });
        return status.state;
    } catch {
        try {
            const status = await nav.permissions.query({ name: "bluetooth-le" });
            return status.state;
        } catch {
            return "unknown";
        }
    }
};

const read_availability = (): BleAvailability => {
    const window_available = typeof window !== "undefined";
    const navigator_available = typeof navigator !== "undefined";
    const secure_context = window_available && window.isSecureContext === true;
    const bluetooth_available = navigator_available && has_bluetooth(navigator);
    return {
        supported: window_available && navigator_available && secure_context && bluetooth_available,
        secure_context,
        window_available,
        navigator_available,
        bluetooth_available
    };
};

const read_adapter_availability = async (bluetooth: BleBluetooth): Promise<boolean | "unknown"> => {
    if (!bluetooth.getAvailability) return "unknown";
    try {
        return await bluetooth.getAvailability();
    } catch {
        return "unknown";
    }
};

const read_availability_state = async (): Promise<BleAvailabilityState> => {
    const availability = read_availability();
    let adapter_available: boolean | "unknown" = "unknown";
    if (typeof navigator !== "undefined" && has_bluetooth(navigator)) {
        adapter_available = await read_adapter_availability(navigator.bluetooth);
    }
    return { ...availability, adapter_available };
};

const resolve_request_options = (profile: BleServiceProfile, opts?: BleConnectOptions): BleRequestDeviceOptions => {
    const optional_services = [profile.service_uuid];
    if (opts?.accept_all_devices) {
        return {
            acceptAllDevices: true,
            optionalServices: optional_services
        };
    }
    const filter: BleRequestDeviceFilter = {
        services: [profile.service_uuid]
    };
    if (opts?.name_prefix) filter.namePrefix = opts.name_prefix;
    return {
        filters: [filter],
        optionalServices: optional_services
    };
};

const map_ble_error = (err: unknown, fallback: BleErrorMessage): BleErrorMessage => {
    if (typeof DOMException !== "undefined" && err instanceof DOMException) {
        if (err.name === "AbortError") return BLE_ERROR.abort;
        if (err.name === "NotAllowedError") return BLE_ERROR.permission_denied;
        if (err.name === "NotSupportedError") return BLE_ERROR.unsupported;
        if (err.name === "SecurityError") return BLE_ERROR.secure_context_required;
        if (err.name === "NotFoundError") return BLE_ERROR.device_not_found;
        if (err.name === "NetworkError") return BLE_ERROR.connect_failed;
        if (err.name === "InvalidStateError") return BLE_ERROR.connect_failed;
        if (err.name === "NotReadableError") return BLE_ERROR.read_failed;
    }
    return fallback;
};

const link_abort_signal = (controller: AbortController, signal?: AbortSignal): void => {
    if (!signal) return;
    if (signal.aborted) {
        controller.abort();
        return;
    }
    signal.addEventListener("abort", () => controller.abort(), { once: true });
};

const wait_with_timeout = async <T>(promise: Promise<T>, timeout_ms?: number): Promise<BleWaitResult<T>> => {
    if (!timeout_ms || timeout_ms <= 0) return { value: await promise };
    let timeout_id: ReturnType<typeof setTimeout> | undefined;
    const timeout_promise: Promise<{ timeout: true }> = new Promise(resolve => {
        timeout_id = setTimeout(() => resolve({ timeout: true }), timeout_ms);
    });
    const guarded = promise.then(value => ({ value }));
    const result = await Promise.race([guarded, timeout_promise]);
    if (timeout_id) clearTimeout(timeout_id);
    if ("timeout" in result) {
        void guarded.catch(() => undefined);
        return result;
    }
    return result;
};

const is_timeout = <T>(value: BleWaitResult<T>): value is { timeout: true } => "timeout" in value;

const is_error = <T>(value: ResolveErrorMsg<T, BleErrorMessage>): value is { err: BleErrorMessage } => {
    return typeof value === "object" && value !== null && "err" in value;
};

const build_device_info = (device: BleDevice, gatt: BleGattServer): BleDeviceInfo => {
    return {
        id: device.id,
        name: device.name,
        connected: gatt.connected
    };
};

class BleSession implements IBleSession {
    private active = true;
    private on_message?: BleMessageHandler;
    private on_disconnect?: BleDisconnectHandler;
    private readonly notify_handler: (event: Event) => void;
    private readonly disconnect_handler: () => void;

    private constructor(
        private readonly device: BleDevice,
        private readonly gatt: BleGattServer,
        private readonly write_characteristic: BleGattCharacteristic,
        private readonly notify_characteristic: BleGattCharacteristic
    ) {
        this.notify_handler = () => this.handle_notify();
        this.disconnect_handler = () => this.stop_with_reason(BLE_ERROR.disconnected, true);
        this.device.addEventListener("gattserverdisconnected", this.disconnect_handler);
        this.notify_characteristic.addEventListener("characteristicvaluechanged", this.notify_handler);
    }

    public static async create(
        device: BleDevice,
        gatt: BleGattServer,
        write_characteristic: BleGattCharacteristic,
        notify_characteristic: BleGattCharacteristic,
        timeout_ms?: number
    ): Promise<ResolveErrorMsg<BleSession, BleErrorMessage>> {
        const session = new BleSession(device, gatt, write_characteristic, notify_characteristic);
        try {
            const result = await wait_with_timeout(notify_characteristic.startNotifications(), timeout_ms);
            if (is_timeout(result)) {
                session.stop_with_reason(BLE_ERROR.timeout, false);
                return err_msg(BLE_ERROR.timeout);
            }
            return session;
        } catch (e) {
            session.stop_with_reason(BLE_ERROR.notify_failed, false);
            return err_msg(map_ble_error(e, BLE_ERROR.notify_failed));
        }
    }

    public get_active(): boolean {
        return this.active;
    }

    public get_device_info(): BleDeviceInfo {
        return build_device_info(this.device, this.gatt);
    }

    public set_on_message(handler?: BleMessageHandler): void {
        this.on_message = handler;
    }

    public set_on_disconnect(handler?: BleDisconnectHandler): void {
        this.on_disconnect = handler;
    }

    public async send_message(message: BleMessageInput, opts?: BleWriteOptions): Promise<ResolveErrorMsg<void, BleErrorMessage>> {
        if (!this.active) return err_msg(BLE_ERROR.disconnected);
        if (!this.gatt.connected) return err_msg(BLE_ERROR.disconnected);

        const resolved = ble_message_bytes(message);
        if (is_error(resolved)) return resolved;
        const payload = ble_message_buffer_source(resolved);

        const controller = new AbortController();
        link_abort_signal(controller, opts?.signal);
        if (controller.signal.aborted) return err_msg(BLE_ERROR.abort);

        const write_action = opts?.without_response && this.write_characteristic.writeValueWithoutResponse
            ? this.write_characteristic.writeValueWithoutResponse(payload)
            : this.write_characteristic.writeValue(payload);

        try {
            const result = await wait_with_timeout(write_action, opts?.timeout_ms);
            if (is_timeout(result)) return err_msg(BLE_ERROR.timeout);
            if (controller.signal.aborted) return err_msg(BLE_ERROR.abort);
            return;
        } catch (e) {
            if (controller.signal.aborted) return err_msg(BLE_ERROR.abort);
            return err_msg(map_ble_error(e, BLE_ERROR.write_failed));
        }
    }

    public async disconnect(): Promise<void> {
        this.stop_with_reason(BLE_ERROR.disconnected, true);
    }

    private handle_notify(): void {
        if (!this.active) return;
        const value = this.notify_characteristic.value;
        if (!value) return;
        const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        if (this.on_message) this.on_message({ bytes, timestamp_ms: Date.now() });
    }

    private stop_with_reason(reason: BleErrorMessage, notify_disconnect: boolean): void {
        if (!this.active) return;
        this.active = false;
        this.device.removeEventListener("gattserverdisconnected", this.disconnect_handler);
        this.notify_characteristic.removeEventListener("characteristicvaluechanged", this.notify_handler);
        if (this.notify_characteristic.stopNotifications) void this.notify_characteristic.stopNotifications();
        if (this.gatt.connected) this.gatt.disconnect();
        if (notify_disconnect && this.on_disconnect) this.on_disconnect(reason);
    }
}

export interface IWebBle extends IBle { }

export class WebBle implements IWebBle {
    public availability(): BleAvailability {
        return read_availability();
    }

    public async availability_state(): Promise<BleAvailabilityState> {
        return read_availability_state();
    }

    public async permission_state(): Promise<BlePermissionState> {
        if (typeof navigator === "undefined") return "unknown";
        return read_permission_state(navigator);
    }

    public async connect(opts?: BleConnectOptions): Promise<ResolveErrorMsg<IBleSession, BleErrorMessage>> {
        const availability = read_availability();
        if (!availability.window_available) return err_msg(BLE_ERROR.window_undefined);
        if (!availability.navigator_available) return err_msg(BLE_ERROR.navigator_undefined);
        if (!availability.secure_context) return err_msg(BLE_ERROR.secure_context_required);
        if (!availability.bluetooth_available) return err_msg(BLE_ERROR.unsupported);

        if (!has_bluetooth(navigator)) return err_msg(BLE_ERROR.unsupported);
        const bluetooth = navigator.bluetooth;
        const adapter_available = await read_adapter_availability(bluetooth);
        if (adapter_available === false) return err_msg(BLE_ERROR.unavailable);
        const permission_state = await read_permission_state(navigator);
        if (permission_state === "denied") return err_msg(BLE_ERROR.permission_denied);

        const controller = new AbortController();
        link_abort_signal(controller, opts?.signal);
        if (controller.signal.aborted) return err_msg(BLE_ERROR.abort);

        const profile = opts?.profile ?? BLE_MESSAGE_PROFILE;
        const request_options = resolve_request_options(profile, opts);

        let device: BleDevice;
        try {
            device = await bluetooth.requestDevice(request_options);
        } catch (e) {
            return err_msg(map_ble_error(e, BLE_ERROR.connect_failed));
        }

        if (controller.signal.aborted) return err_msg(BLE_ERROR.abort);
        if (!device.gatt) return err_msg(BLE_ERROR.connect_failed);

        let server: BleGattServer;
        try {
            const result = await wait_with_timeout(device.gatt.connect(), opts?.timeout_ms);
            if (is_timeout(result)) return err_msg(BLE_ERROR.timeout);
            server = result.value;
        } catch (e) {
            return err_msg(map_ble_error(e, BLE_ERROR.connect_failed));
        }

        if (controller.signal.aborted) {
            server.disconnect();
            return err_msg(BLE_ERROR.abort);
        }

        let service: BleGattService;
        try {
            const result = await wait_with_timeout(server.getPrimaryService(profile.service_uuid), opts?.timeout_ms);
            if (is_timeout(result)) {
                server.disconnect();
                return err_msg(BLE_ERROR.timeout);
            }
            service = result.value;
        } catch (e) {
            server.disconnect();
            return err_msg(map_ble_error(e, BLE_ERROR.service_not_found));
        }
        if (controller.signal.aborted) {
            server.disconnect();
            return err_msg(BLE_ERROR.abort);
        }

        let write_characteristic: BleGattCharacteristic;
        try {
            const result = await wait_with_timeout(service.getCharacteristic(profile.client_write_uuid), opts?.timeout_ms);
            if (is_timeout(result)) {
                server.disconnect();
                return err_msg(BLE_ERROR.timeout);
            }
            write_characteristic = result.value;
        } catch (e) {
            server.disconnect();
            return err_msg(map_ble_error(e, BLE_ERROR.characteristic_not_found));
        }
        if (controller.signal.aborted) {
            server.disconnect();
            return err_msg(BLE_ERROR.abort);
        }

        let notify_characteristic: BleGattCharacteristic;
        try {
            const result = await wait_with_timeout(service.getCharacteristic(profile.client_notify_uuid), opts?.timeout_ms);
            if (is_timeout(result)) {
                server.disconnect();
                return err_msg(BLE_ERROR.timeout);
            }
            notify_characteristic = result.value;
        } catch (e) {
            server.disconnect();
            return err_msg(map_ble_error(e, BLE_ERROR.characteristic_not_found));
        }
        if (controller.signal.aborted) {
            server.disconnect();
            return err_msg(BLE_ERROR.abort);
        }

        const session = await BleSession.create(
            device,
            server,
            write_characteristic,
            notify_characteristic,
            opts?.timeout_ms
        );
        if (is_error(session)) {
            server.disconnect();
            return session;
        }
        if (controller.signal.aborted) {
            await session.disconnect();
            return err_msg(BLE_ERROR.abort);
        }
        return session;
    }
}

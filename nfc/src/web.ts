import { err_msg, type ResolveErrorMsg } from "@radroots/utils";
import { NFC_ERROR, type NfcErrorMessage } from "./error.js";
import { nfc_message_to_web, nfc_read_payload_from_event } from "./records.js";
import type {
    INfc,
    INfcScanSession,
    NdefReader,
    NdefWriteOptions,
    NfcAvailability,
    NfcPermissionState,
    NfcRecordInput,
    NfcReadPayload,
    NfcReadHandler,
    NfcErrorHandler,
    NfcScanOptions,
    NfcWriteInput,
    NfcWriteOptions
} from "./types.js";

type NfcStopReason = "user" | "abort" | "timeout" | "error";

type NfcPermissionName = PermissionName | "nfc";

type NfcPermissionDescriptor = {
    name: NfcPermissionName;
};

interface PermissionsNfc {
    query(permissionDesc: NfcPermissionDescriptor): Promise<PermissionStatus>;
}

interface NavigatorWithPermissions extends Navigator {
    permissions: PermissionsNfc;
}

const has_permissions_api = (nav: Navigator): nav is NavigatorWithPermissions => "permissions" in nav;

const read_permission_state = async (nav: Navigator): Promise<NfcPermissionState> => {
    if (!has_permissions_api(nav)) return "unknown";
    try {
        const status = await nav.permissions.query({ name: "nfc" });
        return status.state;
    } catch {
        return "unknown";
    }
};

const read_availability = (): NfcAvailability => {
    const window_available = typeof window !== "undefined";
    const secure_context = window_available && window.isSecureContext === true;
    const reader_available = window_available && typeof window.NDEFReader !== "undefined";
    return {
        supported: window_available && secure_context && reader_available,
        secure_context,
        window_available,
        reader_available
    };
};

const create_reader = (): ResolveErrorMsg<NdefReader, NfcErrorMessage> => {
    const availability = read_availability();
    if (!availability.window_available) return err_msg(NFC_ERROR.window_undefined);
    if (!availability.secure_context) return err_msg(NFC_ERROR.secure_context_required);
    if (!availability.reader_available) return err_msg(NFC_ERROR.unsupported);
    const Reader = window.NDEFReader;
    if (!Reader) return err_msg(NFC_ERROR.unsupported);
    return new Reader();
};

const map_nfc_error = (err: unknown, fallback: NfcErrorMessage): NfcErrorMessage => {
    if (typeof DOMException !== "undefined" && err instanceof DOMException) {
        if (err.name === "AbortError") return NFC_ERROR.abort;
        if (err.name === "NotAllowedError") return NFC_ERROR.permission_denied;
        if (err.name === "NotSupportedError") return NFC_ERROR.unsupported;
        if (err.name === "SecurityError") return NFC_ERROR.secure_context_required;
        if (err.name === "NotReadableError") return NFC_ERROR.read_failed;
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

const create_timeout = (controller: AbortController, timeout_ms?: number): { is_timeout: () => boolean; clear: () => void } => {
    let fired = false;
    let timeout_id: ReturnType<typeof setTimeout> | undefined;
    if (timeout_ms && timeout_ms > 0) {
        timeout_id = setTimeout(() => {
            fired = true;
            controller.abort();
        }, timeout_ms);
    }
    const clear = (): void => {
        if (timeout_id) clearTimeout(timeout_id);
        timeout_id = undefined;
    };
    const is_timeout = (): boolean => fired;
    return { is_timeout, clear };
};

const build_write_options = (controller: AbortController, opts?: NfcWriteOptions): NdefWriteOptions => {
    return {
        signal: controller.signal,
        overwrite: opts?.overwrite
    };
};

const is_message_input = (value: NfcWriteInput): value is { records: NfcRecordInput[] } => {
    if (typeof value !== "object" || value === null) return false;
    if (!("records" in value)) return false;
    return Array.isArray(value.records);
};

const resolve_message = (value: NfcWriteInput): ResolveErrorMsg<string | ReturnType<typeof nfc_message_to_web>, NfcErrorMessage> => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
        if (!value.length) return err_msg(NFC_ERROR.invalid_message);
        return nfc_message_to_web({ records: value });
    }
    if (is_message_input(value)) {
        if (!value.records.length) return err_msg(NFC_ERROR.invalid_message);
        return nfc_message_to_web(value);
    }
    if (typeof value === "object" && value !== null && "records" in value) return err_msg(NFC_ERROR.invalid_message);
    return nfc_message_to_web({ records: [value] });
};

const is_error = <T>(value: ResolveErrorMsg<T, NfcErrorMessage>): value is { err: NfcErrorMessage } => {
    return typeof value === "object" && value !== null && "err" in value;
};

class NfcScanSession implements INfcScanSession {
    private active = true;
    private started = false;
    private stop_reason: NfcStopReason | null = null;
    private on_read?: NfcReadHandler;
    private on_error?: NfcErrorHandler;
    private timeout_id?: ReturnType<typeof setTimeout>;

    constructor(
        private readonly reader: NdefReader,
        private readonly controller: AbortController,
        opts: {
            on_read?: NfcReadHandler;
            on_error?: NfcErrorHandler;
            timeout_ms?: number;
            on_stop: () => void;
        }
    ) {
        this.on_read = opts.on_read;
        this.on_error = opts.on_error;
        if (opts.timeout_ms && opts.timeout_ms > 0) {
            this.timeout_id = setTimeout(() => this.stop_with_reason("timeout"), opts.timeout_ms);
        }
        this.controller.signal.addEventListener("abort", () => {
            if (this.stop_reason) return;
            this.stop_with_reason("abort");
        }, { once: true });
        this.on_stop = opts.on_stop;
    }

    private on_stop: () => void;

    public get_active(): boolean {
        return this.active;
    }

    public get_signal(): AbortSignal {
        return this.controller.signal;
    }

    public set_on_read(handler?: NfcReadHandler): void {
        this.on_read = handler;
    }

    public set_on_error(handler?: NfcErrorHandler): void {
        this.on_error = handler;
    }

    public async start(): Promise<ResolveErrorMsg<void, NfcErrorMessage>> {
        if (this.started) return err_msg(NFC_ERROR.scan_failed);
        this.started = true;
        try {
            this.reader.onreading = event => {
                if (!this.active) return;
                const payload = nfc_read_payload_from_event(event);
                if (this.on_read) this.on_read(payload);
            };
            this.reader.onreadingerror = () => {
                if (!this.active) return;
                if (this.on_error) this.on_error(NFC_ERROR.read_failed);
            };
            await this.reader.scan({ signal: this.controller.signal });
            return;
        } catch (e) {
            const mapped = map_nfc_error(e, NFC_ERROR.scan_failed);
            this.stop_with_reason("error", mapped);
            return err_msg(mapped);
        }
    }

    public async stop(): Promise<void> {
        this.stop_with_reason("user");
    }

    private stop_with_reason(reason: NfcStopReason, error?: NfcErrorMessage): void {
        if (!this.active) return;
        this.active = false;
        this.stop_reason = reason;
        if (this.timeout_id) {
            clearTimeout(this.timeout_id);
            this.timeout_id = undefined;
        }
        this.reader.onreading = null;
        this.reader.onreadingerror = null;
        if (!this.controller.signal.aborted) this.controller.abort();
        this.on_stop();
        if (reason === "abort" && this.on_error) this.on_error(NFC_ERROR.abort);
        if (reason === "timeout" && this.on_error) this.on_error(NFC_ERROR.timeout);
        if (reason === "error" && error && this.on_error) this.on_error(error);
    }
}

export interface IWebNfc extends INfc {}

export class WebNfc implements IWebNfc {
    private scan_session: NfcScanSession | null = null;

    public availability(): NfcAvailability {
        return read_availability();
    }

    public async permission_state(): Promise<NfcPermissionState> {
        if (typeof navigator === "undefined") return "unknown";
        return read_permission_state(navigator);
    }

    public async scan_start(opts?: NfcScanOptions): Promise<ResolveErrorMsg<INfcScanSession, NfcErrorMessage>> {
        if (this.scan_session && this.scan_session.get_active()) return err_msg(NFC_ERROR.scan_in_progress);
        const reader = create_reader();
        if (is_error(reader)) return reader;

        const controller = new AbortController();
        link_abort_signal(controller, opts?.signal);
        if (controller.signal.aborted) return err_msg(NFC_ERROR.abort);

        const session = new NfcScanSession(reader, controller, {
            on_read: opts?.on_read,
            on_error: opts?.on_error,
            timeout_ms: opts?.timeout_ms,
            on_stop: () => {
                if (this.scan_session === session) this.scan_session = null;
            }
        });

        const started = await session.start();
        if (is_error(started)) return started;
        this.scan_session = session;
        return session;
    }

    public async scan_once(opts?: NfcScanOptions): Promise<ResolveErrorMsg<NfcReadPayload, NfcErrorMessage>> {
        const session = await this.scan_start({
            signal: opts?.signal,
            timeout_ms: opts?.timeout_ms
        });
        if (is_error(session)) return session;

        return await new Promise<ResolveErrorMsg<NfcReadPayload, NfcErrorMessage>>(resolve => {
            session.set_on_read(payload => {
                session.stop();
                if (opts?.on_read) opts.on_read(payload);
                resolve(payload);
            });
            session.set_on_error(error => {
                session.stop();
                if (opts?.on_error) opts.on_error(error);
                resolve(err_msg(error));
            });
        });
    }

    public async write(message: NfcWriteInput, opts?: NfcWriteOptions): Promise<ResolveErrorMsg<void, NfcErrorMessage>> {
        const reader = create_reader();
        if (is_error(reader)) return reader;

        const resolved = resolve_message(message);
        if (is_error(resolved)) return resolved;

        const controller = new AbortController();
        link_abort_signal(controller, opts?.signal);

        if (controller.signal.aborted) {
            return err_msg(NFC_ERROR.abort);
        }

        const timeout = create_timeout(controller, opts?.timeout_ms);

        try {
            await reader.write(resolved, build_write_options(controller, opts));
            timeout.clear();
            return;
        } catch (e) {
            if (timeout.is_timeout()) {
                timeout.clear();
                return err_msg(NFC_ERROR.timeout);
            }
            timeout.clear();
            return err_msg(map_nfc_error(e, NFC_ERROR.write_failed));
        }
    }

    public async make_read_only(opts?: NfcWriteOptions): Promise<ResolveErrorMsg<void, NfcErrorMessage>> {
        const reader = create_reader();
        if (is_error(reader)) return reader;
        if (!reader.makeReadOnly) return err_msg(NFC_ERROR.unsupported);

        const controller = new AbortController();
        link_abort_signal(controller, opts?.signal);

        if (controller.signal.aborted) {
            return err_msg(NFC_ERROR.abort);
        }

        const timeout = create_timeout(controller, opts?.timeout_ms);

        try {
            await reader.makeReadOnly(build_write_options(controller, opts));
            timeout.clear();
            return;
        } catch (e) {
            if (timeout.is_timeout()) {
                timeout.clear();
                return err_msg(NFC_ERROR.timeout);
            }
            timeout.clear();
            return err_msg(map_nfc_error(e, NFC_ERROR.make_read_only_failed));
        }
    }
}

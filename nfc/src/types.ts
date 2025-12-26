import type { ResolveErrorMsg } from "@radroots/utils";
import type { NfcErrorMessage } from "./error.js";

export type NfcRecordData = string | ArrayBuffer | ArrayBufferView;

export type NfcTextEncoding = "utf-8" | "utf-16";

export type NfcRecordInput = {
    record_type: string;
    data?: NfcRecordData;
    media_type?: string;
    id?: string;
    encoding?: NfcTextEncoding;
    lang?: string;
};

export type NfcMessageInput = {
    records: NfcRecordInput[];
};

export type NfcRecord = {
    record_type: string;
    data?: NfcRecordData;
    media_type?: string;
    id?: string;
    encoding?: string;
    lang?: string;
};

export type NfcMessage = {
    records: NfcRecord[];
};

export type NfcReadPayload = {
    message: NfcMessage;
    serial_number?: string;
    timestamp_ms: number;
};

export type NfcAvailability = {
    supported: boolean;
    secure_context: boolean;
    window_available: boolean;
    reader_available: boolean;
};

export type NfcPermissionState = PermissionState | "unknown";

export type NfcReadHandler = (payload: NfcReadPayload) => void;
export type NfcErrorHandler = (error: NfcErrorMessage) => void;

export type NfcScanOptions = {
    signal?: AbortSignal;
    timeout_ms?: number;
    on_read?: NfcReadHandler;
    on_error?: NfcErrorHandler;
};

export type NfcWriteOptions = {
    signal?: AbortSignal;
    timeout_ms?: number;
    overwrite?: boolean;
};

export type NfcWriteInput = string | NfcMessageInput | NfcRecordInput | NfcRecordInput[];

export interface INfcScanSession {
    start(): Promise<ResolveErrorMsg<void, NfcErrorMessage>>;
    stop(): Promise<void>;
    get_active(): boolean;
    get_signal(): AbortSignal;
    set_on_read(handler?: NfcReadHandler): void;
    set_on_error(handler?: NfcErrorHandler): void;
}

export interface INfc {
    availability(): NfcAvailability;
    permission_state(): Promise<NfcPermissionState>;
    scan_start(opts?: NfcScanOptions): Promise<ResolveErrorMsg<INfcScanSession, NfcErrorMessage>>;
    scan_once(opts?: NfcScanOptions): Promise<ResolveErrorMsg<NfcReadPayload, NfcErrorMessage>>;
    write(message: NfcWriteInput, opts?: NfcWriteOptions): Promise<ResolveErrorMsg<void, NfcErrorMessage>>;
    make_read_only(opts?: NfcWriteOptions): Promise<ResolveErrorMsg<void, NfcErrorMessage>>;
}

export type NdefRecordData = NfcRecordData;

export type NdefRecordInit = {
    recordType: string;
    mediaType?: string;
    id?: string;
    encoding?: string;
    lang?: string;
    data?: NdefRecordData;
};

export type NdefMessageInit = {
    records: NdefRecordInit[];
};

export type NdefRecord = {
    recordType: string;
    mediaType?: string;
    id?: string;
    encoding?: string;
    lang?: string;
    data?: NdefRecordData;
};

export type NdefMessage = {
    records: NdefRecord[];
};

export type NdefReadingEvent = Event & {
    message: NdefMessage;
    serialNumber?: string;
};

export type NdefScanOptions = {
    signal?: AbortSignal;
};

export type NdefWriteOptions = {
    signal?: AbortSignal;
    overwrite?: boolean;
};

export interface NdefReader {
    scan(options?: NdefScanOptions): Promise<void>;
    write(message: string | NdefMessageInit, options?: NdefWriteOptions): Promise<void>;
    makeReadOnly?(options?: NdefWriteOptions): Promise<void>;
    onreading: ((event: NdefReadingEvent) => void) | null;
    onreadingerror: ((event: Event) => void) | null;
}

export type NdefReaderConstructor = new () => NdefReader;

declare global {
    interface Window {
        NDEFReader?: NdefReaderConstructor;
    }
}

import type {
    NdefMessage,
    NdefMessageInit,
    NdefRecord,
    NdefRecordInit,
    NdefReadingEvent,
    NfcMessage,
    NfcMessageInput,
    NfcRecord,
    NfcRecordData,
    NfcRecordInput,
    NfcReadPayload,
    NfcTextEncoding
} from "./types.js";

export type NfcJsonPrimitive = string | number | boolean | null;
export type NfcJsonValue = NfcJsonPrimitive | NfcJsonValue[] | { [key: string]: NfcJsonValue };

export type NfcRecordTextOptions = {
    id?: string;
    lang?: string;
    encoding?: NfcTextEncoding;
};

export type NfcRecordUrlOptions = {
    id?: string;
};

export type NfcRecordMimeOptions = {
    id?: string;
};

export type NfcRecordJsonOptions = {
    id?: string;
    media_type?: string;
};

export const nfc_record_text = (text: string, opts?: NfcRecordTextOptions): NfcRecordInput => {
    return {
        record_type: "text",
        data: text,
        id: opts?.id,
        lang: opts?.lang,
        encoding: opts?.encoding
    };
};

export const nfc_record_url = (url: string, opts?: NfcRecordUrlOptions): NfcRecordInput => {
    return {
        record_type: "url",
        data: url,
        id: opts?.id
    };
};

export const nfc_record_mime = (media_type: string, data: NfcRecordData, opts?: NfcRecordMimeOptions): NfcRecordInput => {
    return {
        record_type: "mime",
        media_type,
        data,
        id: opts?.id
    };
};

export const nfc_record_json = (value: NfcJsonValue, opts?: NfcRecordJsonOptions): NfcRecordInput => {
    return {
        record_type: "mime",
        media_type: opts?.media_type ?? "application/json",
        data: JSON.stringify(value),
        id: opts?.id
    };
};

export const nfc_message_from_records = (records: NfcRecordInput[]): NfcMessageInput => {
    return { records };
};

export const nfc_message_text = (text: string, opts?: NfcRecordTextOptions): NfcMessageInput => {
    return nfc_message_from_records([nfc_record_text(text, opts)]);
};

export const nfc_message_url = (url: string, opts?: NfcRecordUrlOptions): NfcMessageInput => {
    return nfc_message_from_records([nfc_record_url(url, opts)]);
};

export const nfc_message_mime = (media_type: string, data: NfcRecordData, opts?: NfcRecordMimeOptions): NfcMessageInput => {
    return nfc_message_from_records([nfc_record_mime(media_type, data, opts)]);
};

export const nfc_message_json = (value: NfcJsonValue, opts?: NfcRecordJsonOptions): NfcMessageInput => {
    return nfc_message_from_records([nfc_record_json(value, opts)]);
};

export const nfc_record_data_bytes = (record: NfcRecord): Uint8Array | undefined => {
    const data = record.data;
    if (!data) return;
    if (typeof data === "string") {
        if (typeof TextEncoder === "undefined") return;
        return new TextEncoder().encode(data);
    }
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    return;
};

export const nfc_record_data_text = (record: NfcRecord): string | undefined => {
    const data = record.data;
    if (typeof data === "string") return data;
    const bytes = nfc_record_data_bytes(record);
    if (!bytes) return;
    if (typeof TextDecoder === "undefined") return;
    const encoding = record.encoding === "utf-16" ? "utf-16" : "utf-8";
    try {
        return new TextDecoder(encoding).decode(bytes);
    } catch {
        return;
    }
};

export const nfc_record_to_web = (record: NfcRecordInput): NdefRecordInit => {
    return {
        recordType: record.record_type,
        mediaType: record.media_type,
        id: record.id,
        encoding: record.encoding,
        lang: record.lang,
        data: record.data
    };
};

export const nfc_message_to_web = (message: NfcMessageInput): NdefMessageInit => {
    return {
        records: message.records.map(nfc_record_to_web)
    };
};

export const nfc_record_from_web = (record: NdefRecord): NfcRecord => {
    return {
        record_type: record.recordType,
        media_type: record.mediaType,
        id: record.id,
        encoding: record.encoding,
        lang: record.lang,
        data: record.data ?? undefined
    };
};

export const nfc_message_from_web = (message: NdefMessage): NfcMessage => {
    return {
        records: message.records.map(nfc_record_from_web)
    };
};

export const nfc_read_payload_from_event = (event: NdefReadingEvent): NfcReadPayload => {
    return {
        message: nfc_message_from_web(event.message),
        serial_number: event.serialNumber ?? undefined,
        timestamp_ms: Date.now()
    };
};

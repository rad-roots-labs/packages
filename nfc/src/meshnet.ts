import { nfc_message_json, nfc_record_data_text, nfc_record_json } from "./records.js";
import type { NfcMessageInput, NfcReadPayload, NfcRecord, NfcRecordInput } from "./types.js";

export type NfcMeshnetProfile = {
    display_name: string;
    device_label: string;
};

export type NfcMeshnetPacketProfile = {
    type: "meshnet.profile.v1";
    profile: NfcMeshnetProfile;
    timestamp_ms: number;
};

export type NfcMeshnetPacketChat = {
    type: "meshnet.chat.v1";
    message_id: string;
    profile: NfcMeshnetProfile;
    text: string;
    timestamp_ms: number;
};

export type NfcMeshnetPacket = NfcMeshnetPacketProfile | NfcMeshnetPacketChat;

export const NFC_MESHNET_MEDIA_TYPE = "application/vnd.radroots.meshnet+json";

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_string = (value: unknown): value is string => typeof value === "string";

const is_number = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

const is_profile = (value: unknown): value is NfcMeshnetProfile => {
    if (!is_record(value)) return false;
    return is_string(value.display_name) && is_string(value.device_label);
};

const is_packet_profile = (value: unknown): value is NfcMeshnetPacketProfile => {
    if (!is_record(value)) return false;
    if (value.type !== "meshnet.profile.v1") return false;
    if (!is_profile(value.profile)) return false;
    if (!is_number(value.timestamp_ms)) return false;
    return true;
};

const is_packet_chat = (value: unknown): value is NfcMeshnetPacketChat => {
    if (!is_record(value)) return false;
    if (value.type !== "meshnet.chat.v1") return false;
    if (!is_string(value.message_id)) return false;
    if (!is_profile(value.profile)) return false;
    if (!is_string(value.text)) return false;
    if (!is_number(value.timestamp_ms)) return false;
    return true;
};

export const nfc_meshnet_packet_profile = (
    profile: NfcMeshnetProfile,
    timestamp_ms: number,
): NfcMeshnetPacketProfile => {
    return {
        type: "meshnet.profile.v1",
        profile,
        timestamp_ms,
    };
};

export const nfc_meshnet_packet_chat = (
    profile: NfcMeshnetProfile,
    text: string,
    message_id: string,
    timestamp_ms: number,
): NfcMeshnetPacketChat => {
    return {
        type: "meshnet.chat.v1",
        message_id,
        profile,
        text,
        timestamp_ms,
    };
};

export const nfc_meshnet_record_from_packet = (
    packet: NfcMeshnetPacket,
): NfcRecordInput => {
    return nfc_record_json(packet, { media_type: NFC_MESHNET_MEDIA_TYPE });
};

export const nfc_meshnet_message_from_packet = (
    packet: NfcMeshnetPacket,
): NfcMessageInput => {
    return nfc_message_json(packet, { media_type: NFC_MESHNET_MEDIA_TYPE });
};

export const nfc_meshnet_packet_from_record = (
    record: NfcRecord,
): NfcMeshnetPacket | undefined => {
    if (record.record_type !== "mime") return;
    if (record.media_type !== NFC_MESHNET_MEDIA_TYPE) return;
    const text = nfc_record_data_text(record);
    if (!text) return;
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        return;
    }
    if (is_packet_profile(parsed)) return parsed;
    if (is_packet_chat(parsed)) return parsed;
};

export const nfc_meshnet_packets_from_payload = (
    payload: NfcReadPayload,
): NfcMeshnetPacket[] => {
    const packets: NfcMeshnetPacket[] = [];
    for (const record of payload.message.records) {
        const packet = nfc_meshnet_packet_from_record(record);
        if (packet) packets.push(packet);
    }
    return packets;
};

import { ble_message_text } from "./messages.js";
import type { BleMessage } from "./types.js";

export type BleMeshnetProfile = {
    display_name: string;
    device_label: string;
};

export type BleMeshnetPacketProfile = {
    type: "meshnet.profile.v1";
    profile: BleMeshnetProfile;
    timestamp_ms: number;
};

export type BleMeshnetPacketChat = {
    type: "meshnet.chat.v1";
    message_id: string;
    profile: BleMeshnetProfile;
    text: string;
    timestamp_ms: number;
};

export type BleMeshnetPacket = BleMeshnetPacketProfile | BleMeshnetPacketChat;

const is_record = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const is_string = (value: unknown): value is string => typeof value === "string";

const is_number = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

const is_profile = (value: unknown): value is BleMeshnetProfile => {
    if (!is_record(value)) return false;
    return is_string(value.display_name) && is_string(value.device_label);
};

const is_packet_profile = (value: unknown): value is BleMeshnetPacketProfile => {
    if (!is_record(value)) return false;
    if (value.type !== "meshnet.profile.v1") return false;
    if (!is_profile(value.profile)) return false;
    if (!is_number(value.timestamp_ms)) return false;
    return true;
};

const is_packet_chat = (value: unknown): value is BleMeshnetPacketChat => {
    if (!is_record(value)) return false;
    if (value.type !== "meshnet.chat.v1") return false;
    if (!is_string(value.message_id)) return false;
    if (!is_profile(value.profile)) return false;
    if (!is_string(value.text)) return false;
    if (!is_number(value.timestamp_ms)) return false;
    return true;
};

export const ble_meshnet_packet_profile = (
    profile: BleMeshnetProfile,
    timestamp_ms: number,
): BleMeshnetPacketProfile => {
    return {
        type: "meshnet.profile.v1",
        profile,
        timestamp_ms,
    };
};

export const ble_meshnet_packet_chat = (
    profile: BleMeshnetProfile,
    text: string,
    message_id: string,
    timestamp_ms: number,
): BleMeshnetPacketChat => {
    return {
        type: "meshnet.chat.v1",
        message_id,
        profile,
        text,
        timestamp_ms,
    };
};

export const ble_meshnet_message_from_packet = (
    packet: BleMeshnetPacket,
): string => {
    return JSON.stringify(packet);
};

export const ble_meshnet_packet_from_text = (
    text: string,
): BleMeshnetPacket | undefined => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        return;
    }
    if (is_packet_profile(parsed)) return parsed;
    if (is_packet_chat(parsed)) return parsed;
};

export const ble_meshnet_packet_from_message = (
    message: BleMessage,
): BleMeshnetPacket | undefined => {
    const text = ble_message_text(message.bytes);
    if (!text) return;
    return ble_meshnet_packet_from_text(text);
};

import init_wasm, { type InitOutput } from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../types/lib.js";

let codec_wasm_init_promise: Promise<InitOutput> | null = null;

export const ensure_codec_wasm = async (): Promise<void> => {
    if (!codec_wasm_init_promise) codec_wasm_init_promise = init_wasm();
    await codec_wasm_init_promise;
};

const is_string_array = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

const is_tag_list = (value: unknown): value is NostrEventTags =>
    Array.isArray(value) && value.every(is_string_array);

export const parse_tags_json = (value: string): NostrEventTags => {
    const parsed: unknown = JSON.parse(value);
    if (!is_tag_list(parsed)) throw new Error("invalid nostr tags");
    return parsed;
};

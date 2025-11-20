import type { RadrootsRelayDocument } from "@radroots/events-bindings";

const nostr_relay_form_field_record: Record<keyof RadrootsRelayDocument, true> = {
    name: true,
    description: true,
    pubkey: true,
    contact: true,
    supported_nips: true,
    software: true,
    version: true
};

const is_nostr_relay_form_field = (value: string): value is keyof RadrootsRelayDocument => {
    return value in nostr_relay_form_field_record;
};

export const nostr_relay_parse_form_keys = (value: string): keyof RadrootsRelayDocument | "" => {
    if (is_nostr_relay_form_field(value)) {
        return value;
    }
    return "";
};

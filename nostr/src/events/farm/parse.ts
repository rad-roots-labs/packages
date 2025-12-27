import { KIND_FARM, radroots_farm_schema, type RadrootsFarm } from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { get_event_tag, parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";

export type RadrootsFarmNostrEvent = NostrEventBasis<typeof KIND_FARM> & { farm: RadrootsFarm };

export const parse_nostr_farm_event = (
    event: NostrEvent,
): RadrootsFarmNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_FARM);
    if (!ev) return undefined;
    const d_tag = get_event_tag(event.tags, "d");
    if (!d_tag) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const farm = radroots_farm_schema.parse(parsed);
        if (farm.d_tag !== d_tag) return undefined;
        return { ...ev, farm };
    } catch {
        return undefined;
    }
};

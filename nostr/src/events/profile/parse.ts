import type { RadrootsProfile } from "@radroots/events-bindings";
import { radroots_profile_schema } from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";
import { KIND_RADROOTS_PROFILE, type KindRadrootsProfile } from "./lib.js";

export type RadrootsProfileNostrEvent = NostrEventBasis<KindRadrootsProfile> & { profile: RadrootsProfile };

export const parse_nostr_profile_event = (
    event: NostrEvent,
): RadrootsProfileNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_PROFILE);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const profile = radroots_profile_schema.parse(parsed);
        return { ...ev, profile };
    } catch {
        return undefined;
    }
};

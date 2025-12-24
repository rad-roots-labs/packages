import type { RadrootsFollow } from "@radroots/events-bindings";
import { radroots_follow_schema } from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";
import { KIND_RADROOTS_FOLLOW, type KindRadrootsFollow } from "./lib.js";

export type RadrootsFollowNostrEvent = NostrEventBasis<KindRadrootsFollow> & { follow: RadrootsFollow };

export const parse_nostr_follow_event = (
    event: NostrEvent,
): RadrootsFollowNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_FOLLOW);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const follow = radroots_follow_schema.parse(parsed);
        return { ...ev, follow };
    } catch {
        return undefined;
    }
};

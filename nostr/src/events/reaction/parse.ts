import { KIND_REACTION, radroots_reaction_schema, type RadrootsReaction } from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";

export type RadrootsReactionNostrEvent = NostrEventBasis<typeof KIND_REACTION> & { reaction: RadrootsReaction };

export const parse_nostr_reaction_event = (
    event: NostrEvent,
): RadrootsReactionNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_REACTION);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const reaction = radroots_reaction_schema.parse(parsed);
        return { ...ev, reaction };
    } catch {
        return undefined;
    }
};

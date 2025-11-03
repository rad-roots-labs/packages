import { NDKEvent } from "@nostr-dev-kit/ndk";
import { RadrootsReaction, radroots_reaction_schema } from "@radroots/events-bindings";
import { parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_REACTION, type KindRadrootsReaction } from "./lib.js";

export type RadrootsReactionNostrEvent = NdkEventBasis<KindRadrootsReaction> & { reaction: RadrootsReaction; }

export const parse_nostr_reaction_event = (event: NDKEvent): RadrootsReactionNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_REACTION);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const reaction = radroots_reaction_schema.parse(parsed);
        return { ...ev, reaction };
    } catch {
        return undefined;
    }
};

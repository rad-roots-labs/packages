import type { NostrEvent } from "../types/nostr.js";
import { parse_nostr_comment_event, RadrootsCommentNostrEvent } from "./comment/parse.js";
import { parse_nostr_follow_event, RadrootsFollowNostrEvent } from "./follow/parse.js";
import { parse_nostr_listing_event, RadrootsListingNostrEvent } from "./listing/parse.js";
import { parse_nostr_profile_event, RadrootsProfileNostrEvent } from "./profile/parse.js";
import { parse_nostr_reaction_event, RadrootsReactionNostrEvent } from "./reaction/parse.js";

export type NostrEventBasis<T extends number> = {
    id: string;
    published_at: number;
    author: string;
    kind: T;
};

export type NostrEventPayload =
    | RadrootsProfileNostrEvent
    | RadrootsListingNostrEvent
    | RadrootsCommentNostrEvent
    | RadrootsReactionNostrEvent
    | RadrootsFollowNostrEvent;

export const nostr_event_on = (event: NostrEvent): NostrEventPayload | undefined => {
    if (!event || typeof event.kind !== "number") return undefined;

    switch (event.kind) {
        case 0: return parse_nostr_profile_event(event);
        case 30402: return parse_nostr_listing_event(event);
        case 1111: return parse_nostr_comment_event(event);
        case 7: return parse_nostr_reaction_event(event);
        case 3: return parse_nostr_follow_event(event);
        default: return undefined;
    }
};

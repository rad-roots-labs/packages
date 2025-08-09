import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NostrEventComment, NostrEventFollow, NostrEventListing, NostrEventReaction, type NostrEventMetadata } from "../types/lib.js";
import { parse_nostr_comment_event } from "./comment/parse.js";
import { parse_nostr_follow_event } from "./follow/parse.js";
import { parse_nostr_listing_event } from "./listing/parse.js";
import { parse_nostr_metadata_event } from "./metadata/parse.js";
import { parse_nostr_reaction_event } from "./reaction/parse.js";

export type NdkEventPayload =
    | { kind: 0; metadata: NostrEventMetadata; }
    | { kind: 30402; listing: NostrEventListing; }
    | { kind: 1111; comment: NostrEventComment; }
    | { kind: 7; reaction: NostrEventReaction; }
    | { kind: 3; follow: NostrEventFollow; }


export const on_ndk_event = (event: NDKEvent): NdkEventPayload | undefined => {
    if (!event || typeof event.kind !== 'number') return undefined;

    switch (event.kind) {
        case 0: {
            const data = parse_nostr_metadata_event(event);
            if (!data) return;
            return { kind: event.kind, metadata: data };
        };
        case 30402: {
            const data = parse_nostr_listing_event(event);
            if (!data) return;
            return { kind: event.kind, listing: data };
        };
        case 1111: {
            const data = parse_nostr_comment_event(event);
            if (!data) return;
            return { kind: event.kind, comment: data };
        };
        case 7: {
            const data = parse_nostr_reaction_event(event);
            if (!data) return;
            return { kind: event.kind, reaction: data };
        };
        case 3: {
            const data = parse_nostr_follow_event(event);
            if (!data) return;
            return { kind: event.kind, follow: data };
        };

        default: return undefined;
    }
};



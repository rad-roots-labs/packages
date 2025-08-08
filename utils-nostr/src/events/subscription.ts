import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NostrEventListing, type NostrEventMetadata } from "../types/lib.js";
import { parse_nostr_listing_event, parse_nostr_metadata_event } from "./parse.js";

export type NdkEventPayload =
    | { kind: 0; metadata: NostrEventMetadata; }
    | { kind: 30402; listing: NostrEventListing; }

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
        default: return undefined;
    }
};



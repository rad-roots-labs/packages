import { NDKEvent } from "@nostr-dev-kit/ndk";
import { type NostrEventMetadata } from "../types/lib.js";
import { parse_nostr_metadata_event } from "./parse.js";

export type NdkEventPayload =
    | { kind: 0; metadata: NostrEventMetadata; }

export const on_ndk_event = (event: NDKEvent): NdkEventPayload | undefined => {
    if (!event || typeof event.kind !== 'number') return undefined;

    switch (event.kind) {
        case 0: {
            const data = parse_nostr_metadata_event(event);
            if (!data) return;
            return { kind: event.kind, metadata: data };
        };

        default: return undefined;
    }
};



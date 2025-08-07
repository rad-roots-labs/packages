import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nostr_event_metadata_schema } from "../schemas/lib.js";
import { type NostrEventMetadata } from "../types/lib.js";

export const parse_nostr_metadata_event = (event: NDKEvent): NostrEventMetadata | undefined => {
    if (!event || typeof event.content !== 'string' || event.kind !== 0) return undefined;

    try {
        const parsed = JSON.parse(event.content);
        const result = nostr_event_metadata_schema.parse(parsed);
        return result;
    } catch {
        return undefined;
    }
};



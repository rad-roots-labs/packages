import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nostr_event_comment_schema } from "../../schemas/lib.js";
import { NostrEventComment } from "../../types/lib.js";

export const parse_nostr_comment_event = (event: NDKEvent): NostrEventComment | undefined => {
    if (!event || typeof event.content !== 'string' || event.kind !== 1111) return undefined;

    try {
        const parsed = JSON.parse(event.content);
        const result = nostr_event_comment_schema.parse(parsed);
        return result;
    } catch {
        return undefined;
    }
};

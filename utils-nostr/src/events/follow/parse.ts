import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nostr_event_follow_schema } from "../../schemas/lib.js";
import { NostrEventFollow } from "../../types/lib.js";

export const parse_nostr_follow_event = (event: NDKEvent): NostrEventFollow | undefined => {
    if (!event || typeof event.content !== 'string' || event.kind !== 3) return undefined;

    try {
        const parsed = JSON.parse(event.content);
        const result = nostr_event_follow_schema.parse(parsed);
        return result;
    } catch {
        return undefined;
    }
};

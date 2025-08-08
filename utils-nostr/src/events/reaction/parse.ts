import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nostr_event_reaction_schema } from "../../schemas/lib.js";
import { NostrEventReaction } from "../../types/lib.js";

export const parse_nostr_reaction_event = (event: NDKEvent): NostrEventReaction | undefined => {
    if (!event || typeof event.content !== 'string' || event.kind !== 7) return undefined;

    try {
        const parsed = JSON.parse(event.content);
        const result = nostr_event_reaction_schema.parse(parsed);
        return result;
    } catch {
        return undefined;
    }
};

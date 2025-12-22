import { NDKEvent } from "@nostr-dev-kit/ndk";
import { radroots_comment_schema, RadrootsComment } from "@radroots/events-bindings";
import { parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_COMMENT, type KindRadrootsComment } from "./lib.js";

export type RadrootsCommentNostrEvent = NdkEventBasis<KindRadrootsComment> & { comment: RadrootsComment; }

export const parse_nostr_comment_event = (event: NDKEvent): RadrootsCommentNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_COMMENT);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const comment = radroots_comment_schema.parse(parsed);
        return { ...ev, comment };
    } catch {
        return undefined;
    }
};


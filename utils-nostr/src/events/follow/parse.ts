import { NDKEvent } from "@nostr-dev-kit/ndk";
import { type RadrootsFollow, radroots_follow_schema } from "@radroots/radroots-common-bindings";
import { parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_FOLLOW, type KindRadrootsFollow } from "./lib.js";

export type RadrootsFollowNostrEvent = NdkEventBasis<KindRadrootsFollow> & { follow: RadrootsFollow; }

export const parse_nostr_follow_event = (event: NDKEvent): RadrootsFollowNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_FOLLOW);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const follow = radroots_follow_schema.parse(parsed);
        return { ...ev, follow };
    } catch {
        return undefined;
    }
};

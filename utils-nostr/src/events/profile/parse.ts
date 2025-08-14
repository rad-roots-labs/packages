import { NDKEvent } from "@nostr-dev-kit/ndk";
import { type RadrootsProfile, radroots_profile_schema } from "@radroots/radroots-common-bindings";
import { parse_nostr_event_basis } from "../lib.js";
import { NdkEventBasis } from "../subscription.js";
import { KIND_RADROOTS_PROFILE, type KindRadrootsProfile } from "./lib.js";

export type RadrootsProfileNostrEvent = NdkEventBasis<KindRadrootsProfile> & { profile: RadrootsProfile; }

export const parse_nostr_profile_event = (event: NDKEvent): RadrootsProfileNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_PROFILE);
    if (!ev) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const profile = radroots_profile_schema.parse(parsed);
        return { ...ev, profile };
    } catch {
        return undefined;
    }
};

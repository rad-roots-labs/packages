import type { NostrEvent } from "../types/nostr.js";
import {
    KIND_COMMENT,
    KIND_FARM,
    KIND_FOLLOW,
    KIND_LISTING,
    KIND_PLOT,
    KIND_PROFILE,
    KIND_REACTION,
} from "@radroots/events-bindings";
import { parse_nostr_comment_event, RadrootsCommentNostrEvent } from "./comment/parse.js";
import { parse_nostr_farm_event, RadrootsFarmNostrEvent } from "./farm/parse.js";
import { parse_nostr_follow_event, RadrootsFollowNostrEvent } from "./follow/parse.js";
import { parse_nostr_listing_event, RadrootsListingNostrEvent } from "./listing/parse.js";
import { parse_nostr_list_event, RadrootsListNostrEvent } from "./list/parse.js";
import { parse_nostr_list_set_event, RadrootsListSetNostrEvent } from "./list_set/parse.js";
import { is_nip51_list_kind } from "./list/lib.js";
import { is_nip51_list_set_kind } from "./list_set/lib.js";
import { parse_nostr_plot_event, RadrootsPlotNostrEvent } from "./plot/parse.js";
import { parse_nostr_profile_event, RadrootsProfileNostrEvent } from "./profile/parse.js";
import { parse_nostr_reaction_event, RadrootsReactionNostrEvent } from "./reaction/parse.js";

export type NostrEventBasis<T extends number> = {
    id: string;
    published_at: number;
    author: string;
    kind: T;
};

export type NostrEventPayload =
    | RadrootsProfileNostrEvent
    | RadrootsListingNostrEvent
    | RadrootsCommentNostrEvent
    | RadrootsReactionNostrEvent
    | RadrootsFollowNostrEvent
    | RadrootsFarmNostrEvent
    | RadrootsPlotNostrEvent
    | RadrootsListNostrEvent
    | RadrootsListSetNostrEvent;

export const nostr_event_on = (event: NostrEvent): NostrEventPayload | undefined => {
    if (!event || typeof event.kind !== "number") return undefined;
    if (is_nip51_list_kind(event.kind)) return parse_nostr_list_event(event);
    if (is_nip51_list_set_kind(event.kind)) return parse_nostr_list_set_event(event);

    switch (event.kind) {
        case KIND_PROFILE: return parse_nostr_profile_event(event);
        case KIND_LISTING: return parse_nostr_listing_event(event);
        case KIND_COMMENT: return parse_nostr_comment_event(event);
        case KIND_REACTION: return parse_nostr_reaction_event(event);
        case KIND_FOLLOW: return parse_nostr_follow_event(event);
        case KIND_FARM: return parse_nostr_farm_event(event);
        case KIND_PLOT: return parse_nostr_plot_event(event);
        default: return undefined;
    }
};

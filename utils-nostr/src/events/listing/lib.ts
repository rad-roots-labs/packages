import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { type RadrootsListing } from "@radroots/events-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";
import { tags_listing } from "./tags.js";

export const KIND_RADROOTS_LISTING = 30402;
export type KindRadrootsListing = typeof KIND_RADROOTS_LISTING;

export const ndk_event_classified = async (opts: NDKEventFigure<{ data: RadrootsListing; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.Classified,
            content: ``,
            tags: tags_listing(data),
        },
    });
};
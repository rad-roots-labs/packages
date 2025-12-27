import { KIND_LISTING, type RadrootsListing } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_listing } from "./tags.js";

export const nostr_event_classified = async (
    opts: NostrEventFigure<{ data: RadrootsListing }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_listing(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_LISTING,
            content: "",
            tags,
        },
    });
};

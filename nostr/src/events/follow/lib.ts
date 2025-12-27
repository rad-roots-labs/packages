import { KIND_FOLLOW, type RadrootsFollow } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_follow } from "./tags.js";

export const nostr_event_follows = async (
    opts: NostrEventFigure<{ data: RadrootsFollow }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_follow(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_FOLLOW,
            content: "",
            tags,
        },
    });
};

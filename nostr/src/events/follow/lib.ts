import type { RadrootsFollow } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_follow_list } from "./tags.js";

export const KIND_RADROOTS_FOLLOW = 3;
export type KindRadrootsFollow = typeof KIND_RADROOTS_FOLLOW;

export const nostr_event_follows = async (
    opts: NostrEventFigure<{ data: RadrootsFollow }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_RADROOTS_FOLLOW,
            content: "",
            tags: tags_follow_list(data.list),
        },
    });
};

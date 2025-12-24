import type { RadrootsComment } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_comment } from "./tags.js";

export const KIND_RADROOTS_COMMENT = 1111;
export type KindRadrootsComment = typeof KIND_RADROOTS_COMMENT;

export const nostr_event_comment = async (
    opts: NostrEventFigure<{ data: RadrootsComment }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_comment(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_RADROOTS_COMMENT,
            content: data.content,
            tags,
        },
    });
};

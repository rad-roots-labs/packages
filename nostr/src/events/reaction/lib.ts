import { KIND_REACTION, type RadrootsReaction } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_reaction } from "./tags.js";

export const nostr_event_reaction = async (
    opts: NostrEventFigure<{ data: RadrootsReaction }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_reaction(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_REACTION,
            content: data.content,
            tags,
        },
    });
};

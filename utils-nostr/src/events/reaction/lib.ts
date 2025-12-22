import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { RadrootsReaction } from "@radroots/events-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";
import { tags_reaction } from "./tags.js";

export const KIND_RADROOTS_REACTION = 7;
export type KindRadrootsReaction = typeof KIND_RADROOTS_REACTION;

export const ndk_event_reaction = async (opts: NDKEventFigure<{ data: RadrootsReaction; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.Reaction,
            content: data.content,
            tags: tags_reaction(data)
        },
    });
};
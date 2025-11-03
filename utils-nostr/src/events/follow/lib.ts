import { NDKEvent } from "@nostr-dev-kit/ndk";
import { RadrootsFollow } from "@radroots/events-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";
import { tags_follow_list } from "./tags.js";

export const KIND_RADROOTS_FOLLOW = 3;
export type KindRadrootsFollow = typeof KIND_RADROOTS_FOLLOW;

export const ndk_event_follows = async (opts: NDKEventFigure<{ data: RadrootsFollow; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: 3,
            content: ``,
            tags: tags_follow_list(data.list),
        },
    });
};
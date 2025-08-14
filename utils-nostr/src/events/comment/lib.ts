import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { type RadrootsComment, } from "@radroots/radroots-common-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { tags_comment } from "../../utils/tags.js";
import { ndk_event } from "../lib.js";

export const KIND_RADROOTS_COMMENT = 1111;
export type KindRadrootsComment = typeof KIND_RADROOTS_COMMENT;

export const ndk_event_comment = async (opts: NDKEventFigure<{ data: RadrootsComment; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.GenericReply,
            content: data.content,
            tags: tags_comment(data)
        },
    });
};
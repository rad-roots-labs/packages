import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { NostrEventComment } from "../../types/lib";
import { NDKEventFigure } from "../../types/ndk";
import { tags_comment } from "../../utils/tags.js";
import { ndk_event } from "../lib.js";

export const ndk_event_comment = async (opts: NDKEventFigure<{ data: NostrEventComment; }>): Promise<NDKEvent | undefined> => {
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
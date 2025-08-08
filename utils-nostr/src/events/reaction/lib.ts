import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { NostrEventReaction } from "../../types/lib.js";
import { NDKEventFigure } from "../../types/ndk.js";
import { tags_reaction } from "../../utils/tags.js";
import { ndk_event } from "../lib.js";

export const ndk_event_reaction = async (opts: NDKEventFigure<{ data: NostrEventReaction; }>): Promise<NDKEvent | undefined> => {
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
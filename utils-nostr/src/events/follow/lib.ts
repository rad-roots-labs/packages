import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NostrEventFollow } from "../../types/lib.js";
import { NDKEventFigure } from "../../types/ndk.js";
import { tags_follow_list } from "../../utils/tags.js";
import { ndk_event } from "../lib.js";

export const ndk_event_follows = async (opts: NDKEventFigure<{ data: NostrEventFollow; }>): Promise<NDKEvent | undefined> => {
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
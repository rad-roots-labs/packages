import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { NostrEventListing } from "../../types/lib.js";
import { NDKEventFigure } from "../../types/ndk.js";
import { tags_classified } from "../../utils/tags.js";
import { ndk_event } from "../lib.js";

export const ndk_event_classified = async (opts: NDKEventFigure<{ data: NostrEventListing; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.Classified,
            content: ``,
            tags: tags_classified(data),
        },
    });
};
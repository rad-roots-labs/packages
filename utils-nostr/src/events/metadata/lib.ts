import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NostrEventMetadata } from "../../types/lib.js";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";

export const ndk_event_metadata = async (opts: NDKEventFigure<{ data: NostrEventMetadata }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: 0,
            content: JSON.stringify(data),
        },
    });
};
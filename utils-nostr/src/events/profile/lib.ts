import { NDKEvent } from "@nostr-dev-kit/ndk";
import { type RadrootsProfile } from "@radroots/events-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";

export const KIND_RADROOTS_PROFILE = 0;
export type KindRadrootsProfile = typeof KIND_RADROOTS_PROFILE;

export const ndk_event_profile = async (opts: NDKEventFigure<{ data: RadrootsProfile }>): Promise<NDKEvent | undefined> => {
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
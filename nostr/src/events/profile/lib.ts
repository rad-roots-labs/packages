import type { RadrootsProfile } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";

export const KIND_RADROOTS_PROFILE = 0;
export type KindRadrootsProfile = typeof KIND_RADROOTS_PROFILE;

export const nostr_event_profile = async (
    opts: NostrEventFigure<{ data: RadrootsProfile }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_RADROOTS_PROFILE,
            content: JSON.stringify(data),
        },
    });
};

import type { RadrootsProfile, RadrootsProfileType } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_profile_type } from "./tags.js";

export const KIND_RADROOTS_PROFILE = 0;
export type KindRadrootsProfile = typeof KIND_RADROOTS_PROFILE;

export const nostr_event_profile = async (
    opts: NostrEventFigure<{ data: RadrootsProfile; profile_type?: RadrootsProfileType }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, profile_type, ...event_opts } = opts;
    const tags = tags_profile_type(profile_type);
    return nostr_event_create({
        ...event_opts,
        basis: {
            kind: KIND_RADROOTS_PROFILE,
            content: JSON.stringify(data),
            tags: tags.length ? tags : undefined,
        },
    });
};

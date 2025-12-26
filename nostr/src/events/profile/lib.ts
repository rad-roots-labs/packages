import type { RadrootsActorType, RadrootsProfile } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_profile_actor } from "./tags.js";

export const KIND_RADROOTS_PROFILE = 0;
export type KindRadrootsProfile = typeof KIND_RADROOTS_PROFILE;

export const nostr_event_profile = async (
    opts: NostrEventFigure<{ data: RadrootsProfile; actor?: RadrootsActorType }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, actor, ...event_opts } = opts;
    const tags = tags_profile_actor(actor);
    return nostr_event_create({
        ...event_opts,
        basis: {
            kind: KIND_RADROOTS_PROFILE,
            content: JSON.stringify(data),
            tags: tags.length ? tags : undefined,
        },
    });
};

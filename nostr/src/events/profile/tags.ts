import type { RadrootsActorType } from "@radroots/events-bindings";
import type { NostrEventTags } from "../../types/lib.js";

const ACTOR_TAG_KEY = "t";
const ACTOR_TAG_PREFIX = "radroots:actor:";

const is_actor_type = (value: string): value is RadrootsActorType =>
    value === "person" || value === "farm";

export const radroots_actor_tag_value = (actor: RadrootsActorType): string =>
    `${ACTOR_TAG_PREFIX}${actor}`;

export const tags_profile_actor = (actor?: RadrootsActorType): NostrEventTags =>
    actor ? [[ACTOR_TAG_KEY, radroots_actor_tag_value(actor)]] : [];

export const parse_profile_actor_tag = (tags: NostrEventTags): RadrootsActorType | undefined => {
    for (const tag of tags) {
        if (tag[0] !== ACTOR_TAG_KEY) continue;
        const value = tag[1];
        if (!value || !value.startsWith(ACTOR_TAG_PREFIX)) continue;
        const actor = value.slice(ACTOR_TAG_PREFIX.length);
        if (is_actor_type(actor)) return actor;
    }
    return undefined;
};

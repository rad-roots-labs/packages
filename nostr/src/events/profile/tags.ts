import type { RadrootsProfileType } from "@radroots/events-bindings";
import type { NostrEventTags } from "../../types/lib.js";

const TYPE_TAG_KEY = "t";
const TYPE_TAG_PREFIX = "radroots:type:";

export const radroots_profile_type_tag_value = (profile_type: RadrootsProfileType): string =>
    `${TYPE_TAG_PREFIX}${profile_type}`;

export const tags_profile_type = (profile_type?: RadrootsProfileType): NostrEventTags =>
    profile_type ? [[TYPE_TAG_KEY, radroots_profile_type_tag_value(profile_type)]] : [];

export const parse_profile_type_tag = (
    tags: NostrEventTags,
): RadrootsProfileType | undefined => {
    for (const tag of tags) {
        if (tag[0] !== TYPE_TAG_KEY) continue;
        const value = tag[1];
        if (!value || !value.startsWith(TYPE_TAG_PREFIX)) continue;
        const profile_type = value.slice(TYPE_TAG_PREFIX.length);
        if (profile_type === "individual" || profile_type === "farm") return profile_type;
    }
    return undefined;
};

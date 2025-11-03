import { RadrootsFollowProfile } from "@radroots/events-bindings";
import { NostrEventTags } from "../../types/lib.js";

export const tags_follow_list = (list: RadrootsFollowProfile[]): NostrEventTags => {
    return list.map(({ public_key, relay_url, contact_name }) => {
        const entry = [`p`, public_key];
        if (relay_url) entry.push(relay_url);
        if (contact_name) entry.push(contact_name);
        return entry;
    });
};
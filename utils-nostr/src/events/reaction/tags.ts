import { RadrootsReaction } from "@radroots/events-bindings";
import { NostrEventTags } from "../../types/lib.js";

export const tags_reaction = (opts: RadrootsReaction): NostrEventTags => {
    const { root } = opts;
    const ref_kind = root.kind.toString();
    const ref_author = root.author;
    const tags: NostrEventTags = [
        [`e`, root.id, ...root.relays || ``],
        [`p`, ref_author],
        [`k`, ref_kind],
    ];
    if (root.d_tag) tags.push([`a`, `${ref_kind}:${ref_author}:${root.d_tag}`, ...root.relays || ``])
    return tags;
};
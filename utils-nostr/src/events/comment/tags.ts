import { RadrootsComment } from "@radroots/events-bindings";
import { NostrEventTags } from "../../types/lib.js";

export const tags_comment = (opts: RadrootsComment): NostrEventTags => {
    const { root: root_event, parent: parent_event } = opts;

    const root = {
        kind: root_event.kind.toString(),
        author: root_event.author,
        id: root_event.id,
        d_tag: root_event.d_tag,
        relays: root_event.relays || [],
    };

    const parent = (parent_event && parent_event.id)
        ? {
            kind: parent_event.kind.toString(),
            author: parent_event.author,
            id: parent_event.id,
            d_tag: parent_event.d_tag,
            relays: parent_event.relays || [],
        }
        : root;

    const tags: NostrEventTags = [
        ["E", root.id, ...root.relays],
        ["P", root.author],
        ["K", root.kind],
        ...(root.d_tag ? [["A", `${root.kind}:${root.author}:${root.d_tag}`, ...root.relays]] : []),
        ["e", parent.id, ...parent.relays],
        ["p", parent.author],
        ["k", parent.kind],
        ...(parent.d_tag ? [["a", `${parent.kind}:${parent.author}:${parent.d_tag}`, ...parent.relays]] : []),
    ];

    return tags;
};
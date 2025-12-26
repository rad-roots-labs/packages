import type { RadrootsListSet } from "@radroots/events-bindings";
import { radroots_list_set_schema } from "@radroots/events-bindings";
import type { NostrEventTags } from "../../types/lib.js";
import type { NostrEvent } from "../../types/nostr.js";
import type { NostrEventBasis } from "../subscription.js";
import { get_event_tag } from "../lib.js";
import { is_nip51_list_set_kind, type KindRadrootsListSet } from "./lib.js";

export type RadrootsListSetNostrEvent =
    NostrEventBasis<KindRadrootsListSet> & { list_set: RadrootsListSet };

const RESERVED_TAGS = new Set(["d", "title", "description", "image"]);

const list_entries_from_tags = (tags: NostrEventTags): RadrootsListSet["entries"] =>
    tags
        .filter(tag => tag.length >= 2 && !RESERVED_TAGS.has(tag[0]))
        .map(tag => ({ tag: tag[0], values: tag.slice(1) }));

export const parse_nostr_list_set_event = (
    event: NostrEvent,
): RadrootsListSetNostrEvent | undefined => {
    if (!event || typeof event.kind !== "number") return undefined;
    if (!is_nip51_list_set_kind(event.kind)) return undefined;
    if (typeof event.created_at !== "number") return undefined;
    const d_tag = get_event_tag(event.tags, "d");
    if (!d_tag) return undefined;
    try {
        const list_set_raw = {
            d_tag,
            content: event.content ?? "",
            entries: list_entries_from_tags(event.tags),
            title: get_event_tag(event.tags, "title") || undefined,
            description: get_event_tag(event.tags, "description") || undefined,
            image: get_event_tag(event.tags, "image") || undefined,
        };
        const list_set = radroots_list_set_schema.parse(list_set_raw);
        return {
            id: event.id,
            published_at: event.created_at,
            author: event.pubkey,
            kind: event.kind,
            list_set,
        };
    } catch {
        return undefined;
    }
};

import type { RadrootsList } from "@radroots/events-bindings";
import { radroots_list_schema } from "@radroots/events-bindings";
import type { NostrEventTags } from "../../types/lib.js";
import type { NostrEvent } from "../../types/nostr.js";
import type { NostrEventBasis } from "../subscription.js";
import { is_nip51_list_kind, type KindRadrootsList } from "./lib.js";

export type RadrootsListNostrEvent = NostrEventBasis<KindRadrootsList> & { list: RadrootsList };

const list_entries_from_tags = (tags: NostrEventTags): RadrootsList["entries"] =>
    tags
        .filter(tag => tag.length >= 2)
        .map(tag => ({ tag: tag[0], values: tag.slice(1) }));

export const parse_nostr_list_event = (
    event: NostrEvent,
): RadrootsListNostrEvent | undefined => {
    if (!event || typeof event.kind !== "number") return undefined;
    if (!is_nip51_list_kind(event.kind)) return undefined;
    if (typeof event.created_at !== "number") return undefined;
    try {
        const list_raw = {
            content: event.content ?? "",
            entries: list_entries_from_tags(event.tags),
        };
        const list = radroots_list_schema.parse(list_raw);
        return {
            id: event.id,
            published_at: event.created_at,
            author: event.pubkey,
            kind: event.kind,
            list,
        };
    } catch {
        return undefined;
    }
};

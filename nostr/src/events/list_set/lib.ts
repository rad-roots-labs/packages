import {
    KIND_LIST_SET_APP_CURATION,
    KIND_LIST_SET_BOOKMARK,
    KIND_LIST_SET_CALENDAR,
    KIND_LIST_SET_CURATION,
    KIND_LIST_SET_EMOJI,
    KIND_LIST_SET_FOLLOW,
    KIND_LIST_SET_GENERIC,
    KIND_LIST_SET_INTEREST,
    KIND_LIST_SET_KIND_MUTE,
    KIND_LIST_SET_MEDIA_STARTER_PACK,
    KIND_LIST_SET_PICTURE,
    KIND_LIST_SET_RELEASE_ARTIFACT,
    KIND_LIST_SET_RELAY,
    KIND_LIST_SET_STARTER_PACK,
    KIND_LIST_SET_VIDEO,
    type RadrootsListSet,
} from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_list_set } from "./tags.js";

export const NIP51_LIST_SET_KINDS = [
    KIND_LIST_SET_FOLLOW,
    KIND_LIST_SET_GENERIC,
    KIND_LIST_SET_RELAY,
    KIND_LIST_SET_BOOKMARK,
    KIND_LIST_SET_CURATION,
    KIND_LIST_SET_VIDEO,
    KIND_LIST_SET_PICTURE,
    KIND_LIST_SET_KIND_MUTE,
    KIND_LIST_SET_INTEREST,
    KIND_LIST_SET_EMOJI,
    KIND_LIST_SET_RELEASE_ARTIFACT,
    KIND_LIST_SET_APP_CURATION,
    KIND_LIST_SET_CALENDAR,
    KIND_LIST_SET_STARTER_PACK,
    KIND_LIST_SET_MEDIA_STARTER_PACK,
] as const;

export type KindRadrootsListSet = typeof NIP51_LIST_SET_KINDS[number];

export const is_nip51_list_set_kind = (kind: number): kind is KindRadrootsListSet =>
    NIP51_LIST_SET_KINDS.some(value => value === kind);

export const nostr_event_list_set = async (
    opts: NostrEventFigure<{ data: RadrootsListSet; kind: KindRadrootsListSet }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, kind } = opts;
    if (!is_nip51_list_set_kind(kind)) return undefined;
    const tags = await tags_list_set(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind,
            content: data.content,
            tags,
        },
    });
};

export { list_private_entries_json, list_private_entries_parse } from "../list/lib.js";

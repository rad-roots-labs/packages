import type { RadrootsListSet } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_list_set } from "./tags.js";

export const NIP51_LIST_SET_KINDS = [
    30000,
    30001,
    30002,
    30003,
    30004,
    30005,
    30006,
    30007,
    30015,
    30030,
    30063,
    30267,
    31924,
    39089,
    39092,
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

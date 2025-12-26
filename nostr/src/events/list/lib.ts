import type { RadrootsList } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_list } from "./tags.js";

export const NIP51_LIST_KINDS = [
    10000,
    10001,
    10002,
    10003,
    10004,
    10005,
    10006,
    10007,
    10009,
    10012,
    10015,
    10020,
    10030,
    10050,
    10101,
    10102,
] as const;

export type KindRadrootsList = typeof NIP51_LIST_KINDS[number];

export const is_nip51_list_kind = (kind: number): kind is KindRadrootsList =>
    NIP51_LIST_KINDS.some(value => value === kind);

export const nostr_event_list = async (
    opts: NostrEventFigure<{ data: RadrootsList; kind: KindRadrootsList }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, kind } = opts;
    if (!is_nip51_list_kind(kind)) return undefined;
    const tags = await tags_list(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind,
            content: data.content,
            tags,
        },
    });
};

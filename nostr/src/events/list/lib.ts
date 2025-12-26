import type { RadrootsList, RadrootsListEntry } from "@radroots/events-bindings";
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

const is_string_array = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === "string");

export const list_private_entries_json = (entries: RadrootsListEntry[]): string | undefined => {
    const tags: string[][] = [];
    for (const entry of entries) {
        if (!entry.tag.trim()) return undefined;
        const first = entry.values[0];
        if (!first || !first.trim()) return undefined;
        tags.push([entry.tag, ...entry.values]);
    }
    return JSON.stringify(tags);
};

export const list_private_entries_parse = (content: string): RadrootsListEntry[] | undefined => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(content);
    } catch {
        return undefined;
    }
    if (!Array.isArray(parsed)) return undefined;
    const entries: RadrootsListEntry[] = [];
    for (const tag of parsed) {
        if (!is_string_array(tag)) return undefined;
        if (!tag.length) return undefined;
        const [name, ...values] = tag;
        if (!name.trim()) return undefined;
        const first = values[0];
        if (!first || !first.trim()) return undefined;
        entries.push({ tag: name, values });
    }
    return entries;
};

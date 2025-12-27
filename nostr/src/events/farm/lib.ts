import { KIND_FARM, type RadrootsFarm, type RadrootsFarmRef } from "@radroots/events-bindings";
import type { NostrEventTags } from "../../types/lib.js";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_farm } from "./tags.js";

export const nostr_tags_farm_ref = (farm: RadrootsFarmRef): NostrEventTags | undefined => {
    if (!farm.pubkey.trim()) return undefined;
    if (!farm.d_tag.trim()) return undefined;
    return [
        ["p", farm.pubkey],
        ["a", `${KIND_FARM}:${farm.pubkey}:${farm.d_tag}`],
    ];
};

export const nostr_event_farm = async (
    opts: NostrEventFigure<{ data: RadrootsFarm }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_farm(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_FARM,
            content: JSON.stringify(data),
            tags,
        },
    });
};

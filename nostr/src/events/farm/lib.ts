import type { RadrootsFarm } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_farm } from "./tags.js";

export const KIND_RADROOTS_FARM = 30340;
export type KindRadrootsFarm = typeof KIND_RADROOTS_FARM;

export const nostr_event_farm = async (
    opts: NostrEventFigure<{ data: RadrootsFarm }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_farm(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_RADROOTS_FARM,
            content: JSON.stringify(data),
            tags,
        },
    });
};

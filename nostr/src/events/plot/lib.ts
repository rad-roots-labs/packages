import { KIND_PLOT, type RadrootsPlot } from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_plot } from "./tags.js";

export const nostr_event_plot = async (
    opts: NostrEventFigure<{ data: RadrootsPlot }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    const tags = await tags_plot(data);
    return nostr_event_create({
        ...opts,
        basis: {
            kind: KIND_PLOT,
            content: JSON.stringify(data),
            tags,
        },
    });
};

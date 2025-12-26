import type { RadrootsPlot } from "@radroots/events-bindings";
import { radroots_plot_schema } from "@radroots/events-bindings";
import type { NostrEvent } from "../../types/nostr.js";
import { get_event_tag, parse_nostr_event_basis } from "../lib.js";
import type { NostrEventBasis } from "../subscription.js";
import { KIND_RADROOTS_FARM } from "../farm/lib.js";
import { KIND_RADROOTS_PLOT, type KindRadrootsPlot } from "./lib.js";

export type RadrootsPlotNostrEvent = NostrEventBasis<KindRadrootsPlot> & { plot: RadrootsPlot };

type PlotFarmRef = {
    pubkey: string;
    d_tag: string;
};

const parse_farm_addr = (value: string): PlotFarmRef | undefined => {
    const parts = value.split(":");
    if (parts.length < 3) return undefined;
    const kind = Number(parts[0]);
    if (!Number.isFinite(kind) || kind !== KIND_RADROOTS_FARM) return undefined;
    const pubkey = parts[1]?.trim() || "";
    const d_tag = parts.slice(2).join(":").trim();
    if (!pubkey || !d_tag) return undefined;
    return { pubkey, d_tag };
};

export const parse_nostr_plot_event = (
    event: NostrEvent,
): RadrootsPlotNostrEvent | undefined => {
    const ev = parse_nostr_event_basis(event, KIND_RADROOTS_PLOT);
    if (!ev) return undefined;
    const d_tag = get_event_tag(event.tags, "d");
    if (!d_tag) return undefined;
    const farm_addr = get_event_tag(event.tags, "a");
    if (!farm_addr) return undefined;
    const farm_pubkey = get_event_tag(event.tags, "p");
    if (!farm_pubkey) return undefined;
    const farm_ref = parse_farm_addr(farm_addr);
    if (!farm_ref) return undefined;
    if (farm_pubkey !== farm_ref.pubkey) return undefined;
    try {
        const parsed = JSON.parse(event.content);
        const plot = radroots_plot_schema.parse(parsed);
        if (plot.d_tag !== d_tag) return undefined;
        if (plot.farm.pubkey !== farm_ref.pubkey) return undefined;
        if (plot.farm.d_tag !== farm_ref.d_tag) return undefined;
        return { ...ev, plot };
    } catch {
        return undefined;
    }
};

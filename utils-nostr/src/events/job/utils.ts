import { JobInputType, KIND_JOB_FEEDBACK } from "@radroots/events-bindings";
import {
    REQUEST_KINDS,
    RESULT_KINDS,
    TRADE_LISTING_STAGE,
    TRADE_LISTING_STAGE_KINDS,
} from "../../domain/trade/lib.js";
import type { TradeListingStageKind } from "../../domain/trade/lib.js";
import type { NostrEventTags } from "../../types/lib.js";

export function get_job_input_data_for_marker(
    tags: NostrEventTags,
    marker: string,
    input_type: JobInputType = "event"
): string | undefined {
    for (const t of tags) {
        if (t[0] !== "i") continue;
        if (t[2] !== input_type) continue;
        const tag_marker = t.length >= 5 ? t[4] : t.length >= 4 ? t[3] : undefined;
        if (tag_marker === marker) return t[1];
    }
    return undefined;
}

export function get_trade_listing_stage_from_event_kind(
    kind: number
): TradeListingStageKind | undefined {
    for (const stage_kind of TRADE_LISTING_STAGE_KINDS) {
        if (REQUEST_KINDS[stage_kind] === kind) return stage_kind;
        if (RESULT_KINDS[stage_kind] === kind) return stage_kind;
    }
    if (kind === KIND_JOB_FEEDBACK) return TRADE_LISTING_STAGE.Order;
    return undefined;
}

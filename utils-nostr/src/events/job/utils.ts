import { JobInputType, KIND_JOB_FEEDBACK } from "@radroots/events-bindings";
import { TradeListingStage } from "@radroots/trade-bindings";
import {
    REQUEST_KINDS,
    RESULT_KINDS,
} from "../../domain/trade/lib.js";
import type { NostrEventTags } from "../../types/lib.js";

export function get_job_input_data_for_marker(
    tags: NostrEventTags,
    marker: string,
    input_type: JobInputType = JobInputType.Event
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
): TradeListingStage | undefined {
    for (const key of Object.keys(REQUEST_KINDS) as TradeListingStage[]) {
        if (REQUEST_KINDS[key] === kind) return key;
    }
    for (const key of Object.keys(RESULT_KINDS) as TradeListingStage[]) {
        if (RESULT_KINDS[key] === kind) return key;
    }
    if (kind === KIND_JOB_FEEDBACK) return TradeListingStage.Order;
    return undefined;
}

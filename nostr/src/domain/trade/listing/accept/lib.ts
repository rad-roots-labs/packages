import { RadrootsJobInput } from "@radroots/events-bindings";
import {
    KIND_TRADE_LISTING_ACCEPT_REQ,
    KIND_TRADE_LISTING_ACCEPT_RES,
    MARKER_LISTING,
    MARKER_ORDER_RESULT,
    TradeListingAcceptRequest,
    TradeListingAcceptResult,
} from "@radroots/trade-bindings";
import { nostr_event_create } from "../../../../events/lib.js";
import type { NostrEventFigure, NostrSignedEvent } from "../../../../types/nostr.js";
import {
    build_request_tags,
    build_result_tags,
    CommonRequestOpts,
    CommonResultOpts,
    make_event_input,
} from "../../tags.js";
import { tags_trade_listing_chain } from "../tags.js";

export const nostr_event_trade_listing_accept_request = async (
    opts: NostrEventFigure<{ data: TradeListingAcceptRequest; options?: CommonRequestOpts }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, options } = opts;

    const inputs: RadrootsJobInput[] = [
        make_event_input(data.order_result_event_id, MARKER_ORDER_RESULT),
        make_event_input(data.listing_event_id, MARKER_LISTING),
    ];

    const tags = build_request_tags(KIND_TRADE_LISTING_ACCEPT_REQ, inputs, options);

    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_ACCEPT_REQ, content: "", tags },
    });
};

export const nostr_event_trade_listing_accept_result = async (
    opts: NostrEventFigure<{
        request_event_id: string;
        content: TradeListingAcceptResult | string;
        options?: CommonResultOpts & { chain?: { e_root: string; d?: string; e_prev?: string } };
    }>,
): Promise<NostrSignedEvent | undefined> => {
    const { request_event_id, content, options } = opts;

    const base_tags = build_result_tags(KIND_TRADE_LISTING_ACCEPT_RES, request_event_id, options);

    const tags = options?.chain
        ? [...base_tags, ...tags_trade_listing_chain(options.chain)]
        : base_tags;

    const content_body = typeof content === "string" ? content : JSON.stringify(content);
    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_ACCEPT_RES, content: content_body, tags },
    });
};

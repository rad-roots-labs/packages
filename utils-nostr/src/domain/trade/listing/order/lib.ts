import { NDKEvent } from "@nostr-dev-kit/ndk";
import { RadrootsJobInput } from "@radroots/events-bindings";
import { KIND_TRADE_LISTING_ORDER_REQ, KIND_TRADE_LISTING_ORDER_RES, MARKER_LISTING, MARKER_PAYLOAD, TradeListingOrderResult, type TradeListingOrderRequest } from "@radroots/trade-bindings";
import { ndk_event } from "../../../../events/lib.js";
import { NDKEventFigure } from "../../../../types/ndk.js";
import {
    build_request_tags,
    build_result_tags,
    CommonRequestOpts,
    CommonResultOpts,
    make_event_input,
    make_text_input,
} from "../../tags.js";
import { tags_trade_listing_chain } from "../tags.js";

export const ndk_event_trade_listing_order_request = async (
    opts: NDKEventFigure<{ data: TradeListingOrderRequest; options?: CommonRequestOpts }>
): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data, options } = opts;

    const inputs: RadrootsJobInput[] = [
        make_event_input(data.event.id, MARKER_LISTING),
        make_text_input(data.payload, MARKER_PAYLOAD),
    ];

    const tags = build_request_tags(KIND_TRADE_LISTING_ORDER_REQ, inputs, options);

    return await ndk_event({
        ndk,
        ndk_user,
        basis: { kind: KIND_TRADE_LISTING_ORDER_REQ, content: "", tags },
        client: opts.client,
        date_published: opts.date_published,
    });
};

export const ndk_event_trade_listing_order_result = async (
    opts: NDKEventFigure<{
        request_event_id: string;
        content: TradeListingOrderResult | string;
        options?: CommonResultOpts;
    }>
): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, request_event_id, content, options } = opts;

    const include_inputs =
        options?.include_inputs && !options.encrypted
            ? options.include_inputs.map(s => make_text_input(s, MARKER_PAYLOAD))
            : [];

    const base_tags = build_result_tags(
        KIND_TRADE_LISTING_ORDER_RES,
        request_event_id,
        options,
        { inputs: include_inputs }
    );

    const tags = options?.chain
        ? [...base_tags, ...tags_trade_listing_chain(options.chain)]
        : base_tags;

    const content_body = typeof content === "string" ? content : JSON.stringify(content);
    return await ndk_event({
        ndk,
        ndk_user,
        basis: { kind: KIND_TRADE_LISTING_ORDER_RES, content: content_body, tags },
        client: opts.client,
        date_published: opts.date_published,
    });
};

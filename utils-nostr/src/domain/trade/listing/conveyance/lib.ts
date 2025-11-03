import { NDKEvent } from "@nostr-dev-kit/ndk";
import { RadrootsJobInput } from "@radroots/events-bindings";
import { KIND_TRADE_LISTING_CONVEYANCE_REQ, KIND_TRADE_LISTING_CONVEYANCE_RES, MARKER_ACCEPT_RESULT, MARKER_PAYLOAD, TradeListingConveyanceRequest, TradeListingConveyanceResult } from "@radroots/trade-bindings";
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

export const ndk_event_trade_listing_conveyance_request = async (
    opts: NDKEventFigure<{ data: TradeListingConveyanceRequest; options?: CommonRequestOpts }>
): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data, options } = opts;

    const inputs: RadrootsJobInput[] = [
        make_event_input(data.accept_result_event_id, MARKER_ACCEPT_RESULT),
        make_text_input({ method: data.method }, MARKER_PAYLOAD),
    ];

    const tags = build_request_tags(KIND_TRADE_LISTING_CONVEYANCE_REQ, inputs, options);

    return await ndk_event({
        ndk,
        ndk_user,
        basis: { kind: KIND_TRADE_LISTING_CONVEYANCE_REQ, content: "", tags },
        client: opts.client,
        date_published: opts.date_published,
    });
};

export const ndk_event_trade_listing_conveyance_result = async (
    opts: NDKEventFigure<{
        request_event_id: string;
        content: TradeListingConveyanceResult | string;
        options?: CommonResultOpts;
    }>
): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, request_event_id, content, options } = opts;

    const base_tags = build_result_tags(
        KIND_TRADE_LISTING_CONVEYANCE_RES,
        request_event_id,
        options
    );
    const tags = options?.chain
        ? [...base_tags, ...tags_trade_listing_chain(options.chain)]
        : base_tags;

    const content_body = typeof content === "string" ? content : JSON.stringify(content);
    return await ndk_event({
        ndk,
        ndk_user,
        basis: { kind: KIND_TRADE_LISTING_CONVEYANCE_RES, content: content_body, tags },
        client: opts.client,
        date_published: opts.date_published,
    });
};
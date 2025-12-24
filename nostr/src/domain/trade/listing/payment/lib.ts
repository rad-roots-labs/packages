import { RadrootsJobInput } from "@radroots/events-bindings";
import {
    KIND_TRADE_LISTING_PAYMENT_REQ,
    KIND_TRADE_LISTING_PAYMENT_RES,
    MARKER_INVOICE_RESULT,
    MARKER_PROOF,
    TradeListingPaymentProofRequest,
    TradeListingPaymentResult,
} from "@radroots/trade-bindings";
import { nostr_event_create } from "../../../../events/lib.js";
import type { NostrEventFigure, NostrSignedEvent } from "../../../../types/nostr.js";
import {
    build_request_tags,
    build_result_tags,
    CommonRequestOpts,
    CommonResultOpts,
    make_event_input,
    make_text_input,
} from "../../tags.js";
import { tags_trade_listing_chain } from "../tags.js";

export const nostr_event_trade_listing_payment_request = async (
    opts: NostrEventFigure<{ data: TradeListingPaymentProofRequest; options?: CommonRequestOpts }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, options } = opts;

    const inputs: RadrootsJobInput[] = [
        make_event_input(data.invoice_result_event_id, MARKER_INVOICE_RESULT),
        make_text_input(data.proof, MARKER_PROOF),
    ];

    const tags = await build_request_tags(KIND_TRADE_LISTING_PAYMENT_REQ, inputs, options);

    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_PAYMENT_REQ, content: "", tags },
    });
};

export const nostr_event_trade_listing_payment_result = async (
    opts: NostrEventFigure<{
        request_event_id: string;
        content: TradeListingPaymentResult | string;
        options?: CommonResultOpts & { chain?: { e_root: string; d?: string; e_prev?: string } };
    }>,
): Promise<NostrSignedEvent | undefined> => {
    const { request_event_id, content, options } = opts;

    const base_tags = await build_result_tags(
        KIND_TRADE_LISTING_PAYMENT_RES,
        request_event_id,
        options,
    );

    const tags = options?.chain
        ? [...base_tags, ...tags_trade_listing_chain(options.chain)]
        : base_tags;

    const content_body = typeof content === "string" ? content : JSON.stringify(content);
    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_PAYMENT_RES, content: content_body, tags },
    });
};

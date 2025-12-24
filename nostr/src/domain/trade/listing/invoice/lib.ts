import { RadrootsJobInput } from "@radroots/events-bindings";
import {
    KIND_TRADE_LISTING_INVOICE_REQ,
    KIND_TRADE_LISTING_INVOICE_RES,
    MARKER_ACCEPT_RESULT,
    TradeListingInvoiceRequest,
    TradeListingInvoiceResult,
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

export const nostr_event_trade_listing_invoice_request = async (
    opts: NostrEventFigure<{ data: TradeListingInvoiceRequest; options?: CommonRequestOpts }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data, options } = opts;

    const inputs: RadrootsJobInput[] = [
        make_event_input(data.accept_result_event_id, MARKER_ACCEPT_RESULT),
    ];

    const tags = await build_request_tags(KIND_TRADE_LISTING_INVOICE_REQ, inputs, options);

    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_INVOICE_REQ, content: "", tags },
    });
};

export const nostr_event_trade_listing_invoice_result = async (
    opts: NostrEventFigure<{
        request_event_id: string;
        content: TradeListingInvoiceResult | string;
        options?: Omit<CommonResultOpts, "payment_sat" | "payment_bolt11"> & {
            chain?: { e_root: string; d?: string; e_prev?: string };
        };
    }>,
): Promise<NostrSignedEvent | undefined> => {
    const { request_event_id, content, options } = opts;

    const parsed = typeof content === "string" ? undefined : content;

    const base_tags = await build_result_tags(
        KIND_TRADE_LISTING_INVOICE_RES,
        request_event_id,
        options,
        parsed
            ? {
                payment_sat: parsed.total_sat,
                payment_bolt11: parsed.bolt11 ?? undefined,
            }
            : undefined,
    );

    const tags = options?.chain
        ? [...base_tags, ...tags_trade_listing_chain(options.chain)]
        : base_tags;

    const content_body = typeof content === "string" ? content : JSON.stringify(content);
    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_TRADE_LISTING_INVOICE_RES, content: content_body, tags },
    });
};

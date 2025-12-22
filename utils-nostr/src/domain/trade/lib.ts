import { KIND_TRADE_LISTING_ACCEPT_REQ, KIND_TRADE_LISTING_ACCEPT_RES, KIND_TRADE_LISTING_CANCEL_REQ, KIND_TRADE_LISTING_CANCEL_RES, KIND_TRADE_LISTING_CONVEYANCE_REQ, KIND_TRADE_LISTING_CONVEYANCE_RES, KIND_TRADE_LISTING_FULFILL_REQ, KIND_TRADE_LISTING_FULFILL_RES, KIND_TRADE_LISTING_INVOICE_REQ, KIND_TRADE_LISTING_INVOICE_RES, KIND_TRADE_LISTING_ORDER_REQ, KIND_TRADE_LISTING_ORDER_RES, KIND_TRADE_LISTING_PAYMENT_REQ, KIND_TRADE_LISTING_PAYMENT_RES, KIND_TRADE_LISTING_RECEIPT_REQ, KIND_TRADE_LISTING_RECEIPT_RES, KIND_TRADE_LISTING_REFUND_REQ, KIND_TRADE_LISTING_REFUND_RES } from "@radroots/trade-bindings";
import type { TradeListingStage } from "@radroots/trade-bindings";

export type TradeListingStageKind = TradeListingStage["kind"];

export const TRADE_LISTING_STAGE = {
    Order: "order",
    Accept: "accept",
    Conveyance: "conveyance",
    Invoice: "invoice",
    Payment: "payment",
    Fulfillment: "fulfillment",
    Receipt: "receipt",
    Cancel: "cancel",
    Refund: "refund",
} as const satisfies Record<string, TradeListingStageKind>;

export const TRADE_LISTING_STAGE_KINDS = [
    TRADE_LISTING_STAGE.Order,
    TRADE_LISTING_STAGE.Accept,
    TRADE_LISTING_STAGE.Conveyance,
    TRADE_LISTING_STAGE.Invoice,
    TRADE_LISTING_STAGE.Payment,
    TRADE_LISTING_STAGE.Fulfillment,
    TRADE_LISTING_STAGE.Receipt,
    TRADE_LISTING_STAGE.Cancel,
    TRADE_LISTING_STAGE.Refund,
] as const satisfies readonly TradeListingStageKind[];

export const REQUEST_KINDS: Record<TradeListingStageKind, number> = {
    order: KIND_TRADE_LISTING_ORDER_REQ,
    accept: KIND_TRADE_LISTING_ACCEPT_REQ,
    conveyance: KIND_TRADE_LISTING_CONVEYANCE_REQ,
    invoice: KIND_TRADE_LISTING_INVOICE_REQ,
    payment: KIND_TRADE_LISTING_PAYMENT_REQ,
    fulfillment: KIND_TRADE_LISTING_FULFILL_REQ,
    receipt: KIND_TRADE_LISTING_RECEIPT_REQ,
    cancel: KIND_TRADE_LISTING_CANCEL_REQ,
    refund: KIND_TRADE_LISTING_REFUND_REQ,
};

export const RESULT_KINDS: Record<TradeListingStageKind, number> = {
    order: KIND_TRADE_LISTING_ORDER_RES,
    accept: KIND_TRADE_LISTING_ACCEPT_RES,
    conveyance: KIND_TRADE_LISTING_CONVEYANCE_RES,
    invoice: KIND_TRADE_LISTING_INVOICE_RES,
    payment: KIND_TRADE_LISTING_PAYMENT_RES,
    fulfillment: KIND_TRADE_LISTING_FULFILL_RES,
    receipt: KIND_TRADE_LISTING_RECEIPT_RES,
    cancel: KIND_TRADE_LISTING_CANCEL_RES,
    refund: KIND_TRADE_LISTING_REFUND_RES,
};

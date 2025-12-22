import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import type { ndk, StoreWritable } from "@radroots/apps-lib";
import type { TradeListingConveyanceRequest, TradeListingOrderRequestPayload, TradeListingPaymentProofRequest } from "@radroots/trade-bindings";
import { TRADE_LISTING_STAGE } from "@radroots/utils-nostr";
import type { TradeListingStageKind } from "@radroots/utils-nostr";
import type { SvelteMap } from "svelte/reactivity";

export type TradeListingStageKey = keyof typeof TRADE_LISTING_STAGE;

export type TradeFlowServiceError =
    | "error.failed_to_publish"
    | "error.timeout"
    | "error.missing_payload"
    | "error.missing_order_id"
    | "error.missing_prerequisite"
    | "error.not_implemented"
    | "error.service_destroyed";

export interface OrderBundle {
    order_id?: string;
    listing_id: string;
    requests: Partial<Record<TradeListingStageKind, NDKEvent[]>>;
    results: Partial<Record<TradeListingStageKind, NDKEvent[]>>;
    feedback: Partial<Record<TradeListingStageKind, NDKEvent[]>>;
    started_at?: number;
    last_update_at?: number;
    loading: boolean;
}

export interface TradeListingBundle {
    listing?: NDKEvent;
    orders: SvelteMap<string, OrderBundle>;
    pending_orders: SvelteMap<string, OrderBundle>;
}

export type OrderRequestOk = {
    ok: true;
    request: NDKEvent;
    result: NDKEvent;
    order_id: string;
    bundle?: OrderBundle;
};

export type OrderRequestErr = {
    ok: false;
    error: TradeFlowServiceError;
    request?: NDKEvent;
};

export type OrderRequestResult = OrderRequestOk | OrderRequestErr;

export type StageActionOk<S extends TradeListingStageKind> = {
    ok: true;
    stage: S;
    request: NDKEvent;
    result: NDKEvent;
    order_id: string;
    bundle?: OrderBundle;
};

export type StageActionErr<S extends TradeListingStageKind> = {
    ok: false;
    stage: S;
    error: TradeFlowServiceError;
    request?: NDKEvent;
};

export type StageActionResult<S extends TradeListingStageKind> = StageActionOk<S> | StageActionErr<S>;

export type AcceptOptions = {
    listing_id: string;
    order_id: string;
    timeout_ms?: number;
};

export type ConveyanceOptions = {
    listing_id: string;
    order_id: string;
    method: TradeListingConveyanceRequest["method"];
    timeout_ms?: number;
};

export type InvoiceOptions = {
    listing_id: string;
    order_id: string;
    timeout_ms?: number;
};

export type PaymentOptions = {
    listing_id: string;
    order_id: string;
    proof: TradeListingPaymentProofRequest["proof"];
    timeout_ms?: number;
};

export type FulfillmentOptions = {
    listing_id: string;
    order_id: string;
    timeout_ms?: number;
};

export type ReceiptOptions = {
    listing_id: string;
    order_id: string;
    note?: string;
    timeout_ms?: number;
};

export type CancelOptions = {
    listing_id: string;
    order_id: string;
    timeout_ms?: number;
};

export type RefundOptions = {
    listing_id: string;
    order_id: string;
    timeout_ms?: number;
};


export type StagePostInput =
    | { stage: typeof TRADE_LISTING_STAGE.Accept; opts: AcceptOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Conveyance; opts: ConveyanceOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Invoice; opts: InvoiceOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Payment; opts: PaymentOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Fulfillment; opts: FulfillmentOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Receipt; opts: ReceiptOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Cancel; opts: CancelOptions }
    | { stage: typeof TRADE_LISTING_STAGE.Refund; opts: RefundOptions };

export type StagePostOutput =
    | StageActionResult<typeof TRADE_LISTING_STAGE.Accept>
    | StageActionResult<typeof TRADE_LISTING_STAGE.Conveyance>
    | StageActionResult<typeof TRADE_LISTING_STAGE.Invoice>
    | StageActionResult<typeof TRADE_LISTING_STAGE.Payment>
    | StageActionResult<typeof TRADE_LISTING_STAGE.Fulfillment>
    | StageActionResult<typeof TRADE_LISTING_STAGE.Receipt>
    | StageActionErr<typeof TRADE_LISTING_STAGE.Cancel>
    | StageActionErr<typeof TRADE_LISTING_STAGE.Refund>;

export interface CreateTradeFlowServiceOptions {
    ndk: StoreWritable<typeof ndk>;
    ndk_user_store: () => NDKUser;
    authors?: string[];
    kinds?: number[];
    default_timeout_ms?: number;
}

export interface TradeFlowService {
    listings: SvelteMap<string, TradeListingBundle>;

    get_latest_update(): NDKEvent | undefined;

    set_filter_authors(authors?: string[] | undefined): void;
    set_filter_kinds(kinds: number[]): void;

    get_trade_listing_bundle(listing_id: string): TradeListingBundle | undefined;
    get_order_bundle(listing_id: string, order_id: string): OrderBundle | undefined;
    is_loading(event_id: string): boolean;

    on_event(ev: NDKEvent): void;

    order_request(
        listing_id: string,
        payload: TradeListingOrderRequestPayload,
        timeout_ms?: number
    ): Promise<OrderRequestResult>;

    accept_request(opts: AcceptOptions): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Accept>>;
    conveyance_request(
        opts: ConveyanceOptions
    ): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Conveyance>>;
    invoice_request(opts: InvoiceOptions): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Invoice>>;
    payment_request(opts: PaymentOptions): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Payment>>;
    fulfillment_request(
        opts: FulfillmentOptions
    ): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Fulfillment>>;
    receipt_request(opts: ReceiptOptions): Promise<StageActionResult<typeof TRADE_LISTING_STAGE.Receipt>>;

    post(input: StagePostInput): Promise<StagePostOutput>;

    destroy(): void;
}

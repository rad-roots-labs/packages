import { JobInputType, RadrootsJobInput } from "@radroots/events-bindings";
import { tags_job_request, tags_job_result } from "../../events/job/tags.js";

export type CommonRequestOpts = {
    output?: string;
    bid_sat?: number;
    relays?: string[];
    providers?: string[];
    topics?: string[];
    encrypted?: boolean;
    params?: Array<{ key: string; value: string }>;
};

export type CommonResultOpts = {
    request_relay_hint?: string;
    request_json?: string;
    customer_pubkey?: string;
    payment_sat?: number;
    payment_bolt11?: string;
    encrypted?: boolean;
    include_inputs?: string[];
    chain?: { e_root: string; d?: string; e_prev?: string };
};

export const make_event_input = (
    id: string,
    marker: string,
    relay?: string
): RadrootsJobInput => ({
    data: id,
    input_type: JobInputType.Event,
    ...(relay ? { relay } : {}),
    marker,
});

export const make_text_input = (
    payload: unknown,
    marker: string
): RadrootsJobInput => ({
    data: typeof payload === "string" ? payload : JSON.stringify(payload),
    input_type: JobInputType.Text,
    marker,
});

export const build_request_tags = (
    kind: number,
    inputs: RadrootsJobInput[],
    opts?: CommonRequestOpts
) =>
    tags_job_request({
        kind,
        inputs,
        output: opts?.output,
        params: opts?.params ?? [],
        bid_sat: opts?.bid_sat,
        relays: opts?.relays ?? [],
        providers: opts?.providers ?? [],
        topics: opts?.topics ?? [],
        encrypted: !!opts?.encrypted,
    });

export const build_result_tags = (
    kind: number,
    request_event_id: string,
    opts?: CommonResultOpts,
    extra?: {
        inputs?: RadrootsJobInput[];
        payment_sat?: number;
        payment_bolt11?: string;
    }
) =>
    tags_job_result({
        kind,
        request_event: {
            id: request_event_id,
            ...(opts?.request_relay_hint ? { relays: opts.request_relay_hint } : {}),
        },
        request_json: opts?.request_json,
        inputs: !opts?.encrypted && extra?.inputs?.length ? extra.inputs : [],
        customer_pubkey: opts?.customer_pubkey,
        payment:
            extra?.payment_sat !== undefined
                ? { amount_sat: extra.payment_sat, bolt11: extra.payment_bolt11 }
                : opts?.payment_sat !== undefined
                    ? { amount_sat: opts.payment_sat, bolt11: opts.payment_bolt11 }
                    : undefined,
        encrypted: !!opts?.encrypted,
    });

import { NDKEvent } from "@nostr-dev-kit/ndk";
import { JobFeedbackStatus, KIND_JOB_FEEDBACK, RadrootsJobFeedback, RadrootsJobRequest, RadrootsJobResult } from "@radroots/events-bindings";
import { NDKEventFigure } from "../../types/ndk.js";
import { ndk_event } from "../lib.js";
import { tags_job_feedback, tags_job_request, tags_job_result } from "./tags.js";

export const ndk_event_job_request = async (opts: NDKEventFigure<{ data: RadrootsJobRequest; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: data.kind,
            content: "",
            tags: tags_job_request(data),
        },
    });
};

export const ndk_event_job_result = async (opts: NDKEventFigure<{ data: RadrootsJobResult; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: data.kind,
            content: data.content || "",
            tags: tags_job_result(data),
        },
    });
};

export const ndk_event_job_feedback = async (opts: NDKEventFigure<{ data: RadrootsJobFeedback; }>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: data.kind,
            content: data.content || "",
            tags: tags_job_feedback(data),
        },
    });
};

export const ndk_event_job_feedback_todo = async (
    opts: NDKEventFigure<{
        request_event_id: string;
        status:
        | JobFeedbackStatus
        | "payment-required"
        | "processing"
        | "error"
        | "success"
        | "partial";
        content?: string;
        options?: {
            request_relay_hint?: string;
            extra_info?: string;
            customer_pubkey?: string;
            amount_sat?: number;
            bolt11?: string;
            encrypted?: boolean;
        };
    }>
): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, request_event_id, status, content, options } = opts;

    const fb: RadrootsJobFeedback = {
        kind: KIND_JOB_FEEDBACK,
        status: status as JobFeedbackStatus,
        extra_info: options?.extra_info,
        request_event: {
            id: request_event_id,
            ...(options?.request_relay_hint ? { relays: options.request_relay_hint } : {}),
        },
        customer_pubkey: options?.customer_pubkey,
        payment:
            options?.amount_sat !== undefined
                ? { amount_sat: options.amount_sat, bolt11: options?.bolt11 }
                : undefined,
        content,
        encrypted: !!options?.encrypted,
    };

    const tags = tags_job_feedback(fb);

    return await ndk_event({
        ndk,
        ndk_user,
        basis: { kind: KIND_JOB_FEEDBACK, content: content ?? "", tags },
        client: opts.client,
        date_published: opts.date_published,
    });
};
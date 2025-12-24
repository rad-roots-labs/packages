import {
    JobFeedbackStatus,
    KIND_JOB_FEEDBACK,
    RadrootsJobFeedback,
    RadrootsJobRequest,
    RadrootsJobResult,
} from "@radroots/events-bindings";
import type { NostrEventFigure, NostrSignedEvent } from "../../types/nostr.js";
import { nostr_event_create } from "../lib.js";
import { tags_job_feedback, tags_job_request, tags_job_result } from "./tags.js";

export const nostr_event_job_request = async (
    opts: NostrEventFigure<{ data: RadrootsJobRequest }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    return nostr_event_create({
        ...opts,
        basis: {
            kind: data.kind,
            content: "",
            tags: tags_job_request(data),
        },
    });
};

export const nostr_event_job_result = async (
    opts: NostrEventFigure<{ data: RadrootsJobResult }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    return nostr_event_create({
        ...opts,
        basis: {
            kind: data.kind,
            content: data.content || "",
            tags: tags_job_result(data),
        },
    });
};

export const nostr_event_job_feedback = async (
    opts: NostrEventFigure<{ data: RadrootsJobFeedback }>,
): Promise<NostrSignedEvent | undefined> => {
    const { data } = opts;
    return nostr_event_create({
        ...opts,
        basis: {
            kind: data.kind,
            content: data.content || "",
            tags: tags_job_feedback(data),
        },
    });
};

export const nostr_event_job_feedback_todo = async (
    opts: NostrEventFigure<{
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
    }>,
): Promise<NostrSignedEvent | undefined> => {
    const { request_event_id, status, content, options } = opts;

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

    return nostr_event_create({
        ...opts,
        basis: { kind: KIND_JOB_FEEDBACK, content: content ?? "", tags },
    });
};

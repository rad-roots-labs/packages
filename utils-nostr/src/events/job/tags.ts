import { RadrootsJobFeedback, RadrootsJobInput, RadrootsJobRequest, RadrootsJobResult } from "@radroots/events-bindings";
import { NostrEventTag, NostrEventTags } from "../../types/lib.js";

export const tag_job_input = (input: RadrootsJobInput): NostrEventTag => {
    const t: NostrEventTag = ["i", input.data, input.input_type];
    if (input.relay) t.push(input.relay);
    if (input.marker) t.push(input.marker);
    return t;
};

export const tag_job_output = (mime: string): NostrEventTag => ["output", mime];

export const tag_job_param = (key: string, value: string): NostrEventTag => ["param", key, value];

export const tag_job_bid = (sat: number): NostrEventTag => ["bid", String(sat)];

export const tags_job_relays = (relays: string[]): NostrEventTags =>
    relays.map(r => ["relays", r]);

export const tags_job_providers = (pubkeys: string[]): NostrEventTags =>
    pubkeys.map(p => ["p", p]);

export const tags_job_topics = (topics: string[]): NostrEventTags =>
    topics.map(t => ["t", t]);

export const tag_job_amount = (msat: number, bolt11?: string): NostrEventTag =>
    bolt11 ? ["amount", String(msat), bolt11] : ["amount", String(msat)];

export const tag_job_encrypted = (): NostrEventTag => ["encrypted"];

export const tags_job_request = (opts: RadrootsJobRequest): NostrEventTags => {
    const tags: NostrEventTags = [];
    for (const input of opts.inputs) tags.push(tag_job_input(input));
    if (opts.output) tags.push(tag_job_output(opts.output));
    if (opts.params) for (const p of opts.params) tags.push(tag_job_param(p.key, p.value));
    if (typeof opts.bid_sat === "number") tags.push(tag_job_bid(opts.bid_sat));
    if (opts.relays?.length) tags.push(...tags_job_relays(opts.relays));
    if (opts.providers?.length) tags.push(...tags_job_providers(opts.providers));
    if (opts.topics?.length) tags.push(...tags_job_topics(opts.topics));
    if (opts.encrypted) tags.push(tag_job_encrypted());
    return tags;
};

export const tags_job_result = (opts: RadrootsJobResult): NostrEventTags => {
    const tags: NostrEventTags = [];
    const event_tag: NostrEventTag = ["e", opts.request_event.id];
    if (opts.request_event.relays) event_tag.push(opts.request_event.relays);
    tags.push(event_tag);
    if (opts.request_json) tags.push(["request", opts.request_json]);
    if (!opts.encrypted && opts.inputs?.length) for (const input of opts.inputs) tags.push(tag_job_input(input));
    if (opts.customer_pubkey) tags.push(["p", opts.customer_pubkey]);
    if (opts.payment?.amount_sat !== undefined) {
        const msat = Math.round(Number(opts.payment.amount_sat) * 1000);
        tags.push(tag_job_amount(msat, opts.payment.bolt11));
    }
    if (opts.encrypted) tags.push(tag_job_encrypted());
    return tags;
}

export const tags_job_feedback = (opts: RadrootsJobFeedback): NostrEventTags => {
    const tags: NostrEventTags = [];
    const status_tag: NostrEventTag = ["status", String(opts.status)];
    if (opts.extra_info) status_tag.push(opts.extra_info);
    tags.push(status_tag);
    if (opts.payment?.amount_sat !== undefined) {
        const msat = Math.round(Number(opts.payment.amount_sat) * 1000);
        tags.push(tag_job_amount(msat, opts.payment.bolt11));
    }
    const event_tag: NostrEventTag = ["e", opts.request_event.id];
    if (opts.request_event.relays) event_tag.push(opts.request_event.relays);
    tags.push(event_tag);
    if (opts.customer_pubkey) tags.push(["p", opts.customer_pubkey]);
    if (opts.encrypted) tags.push(tag_job_encrypted());
    return tags;
}
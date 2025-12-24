import type {
    RadrootsJobFeedback,
    RadrootsJobRequest,
    RadrootsJobResult,
} from "@radroots/events-bindings";
import {
    job_feedback_tags,
    job_request_tags,
    job_result_tags,
} from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../../types/lib.js";
import { ensure_codec_wasm, parse_tags_json } from "../wasm.js";

export const tags_job_request = async (opts: RadrootsJobRequest): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = job_request_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

export const tags_job_result = async (opts: RadrootsJobResult): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = job_result_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

export const tags_job_feedback = async (opts: RadrootsJobFeedback): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = job_feedback_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

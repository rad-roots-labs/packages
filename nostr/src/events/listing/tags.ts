import type { RadrootsListing } from "@radroots/events-bindings";
import { listing_tags_full } from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../../types/lib.js";
import { ensure_codec_wasm, parse_tags_json } from "../wasm.js";

export const tags_listing = async (opts: RadrootsListing): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const listing_json = JSON.stringify(opts);
    const tags_json = listing_tags_full(listing_json);
    return parse_tags_json(tags_json);
};

import type { RadrootsList } from "@radroots/events-bindings";
import { list_tags } from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../../types/lib.js";
import { ensure_codec_wasm, parse_tags_json } from "../wasm.js";

export const tags_list = async (opts: RadrootsList): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = list_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

import type { RadrootsFarm } from "@radroots/events-bindings";
import { farm_tags } from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../../types/lib.js";
import { ensure_codec_wasm, parse_tags_json } from "../wasm.js";

export const tags_farm = async (opts: RadrootsFarm): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = farm_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

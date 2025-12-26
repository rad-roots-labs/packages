import type { RadrootsPlot } from "@radroots/events-bindings";
import { plot_tags } from "@radroots/events-codec-wasm";
import type { NostrEventTags } from "../../types/lib.js";
import { ensure_codec_wasm, parse_tags_json } from "../wasm.js";

export const tags_plot = async (opts: RadrootsPlot): Promise<NostrEventTags> => {
    await ensure_codec_wasm();
    const tags_json = plot_tags(JSON.stringify(opts));
    return parse_tags_json(tags_json);
};

import { TAG_D, TAG_E_PREV, TAG_E_ROOT } from "@radroots/events-bindings";
import { NostrEventTags } from "../../../types/lib.js";

export const tags_trade_listing_chain = (opts: {
    e_root: string;
    d?: string;
    e_prev?: string;
}): NostrEventTags => {
    const tags: NostrEventTags = [];
    tags.push([TAG_E_ROOT, opts.e_root]);
    if (opts.e_prev) tags.push([TAG_E_PREV, opts.e_prev]);
    if (opts.d) tags.push([TAG_D, opts.d]);
    return tags;
};

import { NostrEventTag, NostrEventTagClient } from "../types/lib.js";

export const TAG_E = 'e';
export const TAG_I = 'i';

export const tag_client = (opts: NostrEventTagClient, d_tag?: string): NostrEventTag => {
    const tag = [`client`, opts.name];
    if (d_tag) tag.push(`31990:${opts.pubkey}:${d_tag}`);
    tag.push(opts.relay);
    return tag;
};

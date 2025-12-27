import { schnorr } from "@noble/curves/secp256k1";
import { hexToBytes } from "@noble/hashes/utils";
import { makeEvent } from "@welshman/util";
import { KIND_POST } from "@radroots/events-bindings";
import { time_now_ms, time_now_s, uuidv4 } from "@radroots/utils";
import {
    finalizeEvent,
    getEventHash,
    nip19,
    type NostrEvent as NostrToolsEvent,
} from "nostr-tools";
import { NostrEventSign, NostrEventTags, NostrNeventEncode } from "../types/lib.js";
import type { NostrEvent, NostrEventFigure, NostrSignedEvent } from "../types/nostr.js";
import { nostr_tag_client } from "../utils/tags.js";
import type { NostrEventBasis } from "./subscription.js";

export const get_event_tag = (tags: NostrEventTags, key: string): string =>
    tags.find(t => t[0] === key)?.[1] ?? "";

export const get_event_tags = (tags: NostrEventTags, key: string): NostrEventTags =>
    tags.filter(t => t[0] === key);

export const parse_nostr_event_basis = <T extends number>(
    event: NostrEvent,
    kind: T,
): NostrEventBasis<T> | undefined => {
    if (!event || typeof event.created_at !== "number" || event.kind !== kind) return undefined;
    return {
        id: event.id,
        published_at: event.created_at,
        author: event.pubkey,
        kind: event.kind as T,
    };
};

export const nostr_event_verify = (event: NostrToolsEvent): boolean => {
    const hash = getEventHash(event);
    if (hash !== event.id) return false;
    const valid = schnorr.verify(event.sig, hash, event.pubkey);
    return valid;
};

export const nostr_event_sign = (opts: NostrEventSign): NostrToolsEvent => {
    return finalizeEvent(opts.event, hexToBytes(opts.secret_key));
};

export const nostr_event_sign_attest = (secret_key: string): NostrToolsEvent => {
    return nostr_event_sign({
        secret_key,
        event: {
            kind: KIND_POST,
            created_at: time_now_s(),
            tags: [],
            content: uuidv4(),
        },
    });
};

export const nostr_event_verify_serialized = async (
    event_serialized: string,
): Promise<{ public_key: string } | undefined> => {
    try {
        const event = JSON.parse(event_serialized) as NostrToolsEvent;
        const hash = getEventHash(event);
        if (hash !== event.id) return undefined;
        const valid = schnorr.verify(event.sig, hash, event.pubkey);
        if (valid) return { public_key: String(event.pubkey) };
        return undefined;
    } catch {
        return undefined;
    }
};

export const nostr_nevent_encode = (opts: NostrNeventEncode): string => {
    return nip19.neventEncode(opts);
};

export const nostr_event_create = async (
    opts: NostrEventFigure<{
        basis: {
            kind: number;
            content: string;
            tags?: NostrEventTags;
        };
    }>,
): Promise<NostrSignedEvent | undefined> => {
    try {
        const time_now = time_now_ms();
        const published_at = opts.date_published
            ? Math.floor(opts.date_published.getTime() / 1000).toString()
            : time_now.toString();
        const tags: NostrEventTags = [["published_at", published_at]];
        if (opts.basis.tags?.length) tags.push(...opts.basis.tags);
        if (opts.client) {
            const d_tag = tags.find(tag => tag[0] === "d")?.[1]
                ?? tags.find(tag => tag[0] === "d_tag")?.[1];
            tags.push(nostr_tag_client(opts.client, d_tag));
        }
        const ev = makeEvent(opts.basis.kind, {
            content: opts.basis.content,
            tags,
            created_at: time_now,
        });
        return await opts.signer.sign(ev);
    } catch {
        return undefined;
    }
};

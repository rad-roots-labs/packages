import { schnorr } from "@noble/curves/secp256k1";
import { hexToBytes } from "@noble/hashes/utils";
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { time_now_ms, uuidv4 } from "@radroots/utils";
import { finalizeEvent, getEventHash, nip19, type NostrEvent as NostrToolsEvent } from "nostr-tools";
import { ILibNostrEventSign, ILibNostrNeventEncode, NostrEventTags } from "../types/lib.js";
import { NDKEventFigure } from "../types/ndk.js";

export const get_event_tag = (tags: NDKTag[], key: string): string => tags.find(t => t[0] === key)?.[1] ?? '';
export const get_event_tags = (tags: NDKTag[], key: string): NDKTag[] => tags.filter(t => t[0] === key);

export const lib_nostr_event_verify = (event: NostrToolsEvent): boolean => {
    const hash = getEventHash(event);
    if (hash !== event.id) return false
    const valid = schnorr.verify(event.sig, hash, event.pubkey);
    return valid;
};

export const lib_nostr_event_sign = (opts: ILibNostrEventSign): NostrToolsEvent => {
    return finalizeEvent(opts.event, hexToBytes(opts.secret_key))
};

export const lib_nostr_event_sign_attest = (secret_key: string): NostrToolsEvent => {
    return lib_nostr_event_sign({
        secret_key,
        event: {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: uuidv4(),
        },
    });
};


export const lib_nostr_event_verify_serialized = async (event_serialized: string): Promise<{ public_key: string } | undefined> => {
    try {
        const event = JSON.parse(event_serialized);
        const hash = getEventHash(event);
        if (hash !== event.id) return undefined;
        const valid = schnorr.verify(event.sig, hash, event.pubkey);
        if (valid) return { public_key: String(event.pubkey) };
        return undefined;
    } catch {
        return undefined;
    }
};

export const lib_nostr_nevent_encode = (opts: ILibNostrNeventEncode): string => {
    return nip19.neventEncode(opts);
};

export const ndk_event = async (opts: NDKEventFigure<{
    basis: {
        kind: number;
        content: string;
        tags?: NostrEventTags;
    }
}>): Promise<NDKEvent | undefined> => {
    try {
        const { ndk: ndk, ndk_user: ndk_user, basis } = opts;
        const time_now = time_now_ms();
        const published_at = opts.date_published ? Math.floor(opts.date_published.getTime() / 1000).toString()
            : time_now.toString()
        const tags: NostrEventTags = [
            ['published_at', published_at],
        ];
        if (basis.tags?.length) tags.push(...basis.tags);
        const ev = new NDKEvent(ndk, {
            kind: basis.kind,
            pubkey: ndk_user.pubkey,
            content: basis.content,
            created_at: time_now,
            tags
        });
        return ev;
    } catch (e) {
        console.log(`(error) ndk_event `, e);
    };
};
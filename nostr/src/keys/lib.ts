import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import {
    generateSecretKey,
    getPublicKey,
    nip19,
} from "nostr-tools";

export const REGEX_NOSTR_KEY = /^[a-f0-9]{64}$/;

export const nostr_key_bytes_from_hex = (hex: string): Uint8Array => {
    return hexToBytes(hex);
};

export const nostr_key_hex_from_bytes = (bytes: Uint8Array): string => {
    return bytesToHex(bytes);
};

export const nostr_key_generate = (): string => {
    const bytes = generateSecretKey();
    return nostr_key_hex_from_bytes(bytes);
};

export const nostr_npub_encode = (public_key_hex?: string): string | undefined => {
    try {
        if (!public_key_hex) return undefined;
        const npub = nip19.npubEncode(public_key_hex);
        return npub;
    } catch {
        return undefined;
    }
};

export const nostr_npub_decode = (npub?: string): string | undefined => {
    try {
        if (!npub) return undefined;
        const { type, data } = nip19.decode(npub);
        if (type === "npub" && data) return data;
    } catch {
        return undefined;
    }
};

export const nostr_nsec_encode = (secret_key_hex?: string): string | undefined => {
    try {
        if (!secret_key_hex) return undefined;
        const bytes = nostr_key_bytes_from_hex(secret_key_hex);
        return nip19.nsecEncode(bytes);
    } catch {
        return undefined;
    }
};

export const nostr_nsec_decode = (nsec?: string): string | undefined => {
    try {
        if (!nsec) return undefined;
        const decode = nip19.decode(nsec);
        if (decode && decode.type === "nsec" && decode.data) return bytesToHex(decode.data);
        return undefined;
    } catch {
        return undefined;
    }
};

export const nostr_nprofile_encode = (
    public_key_hex: string,
    relays: string[],
): string | undefined => {
    try {
        if (!public_key_hex || !relays.length) return undefined;
        const nprofile = nip19.nprofileEncode({ pubkey: public_key_hex, relays });
        return nprofile;
    } catch {
        return undefined;
    }
};

export const nostr_nprofile_decode = (
    nprofile?: string,
): nip19.ProfilePointer | undefined => {
    try {
        if (!nprofile) return undefined;
        const { type, data } = nip19.decode(nprofile);
        if (type === "nprofile" && data) return data;
    } catch {
        return undefined;
    }
};

export const nostr_public_key_from_secret = (secret_key_hex: string): string => {
    const bytes = nostr_key_bytes_from_hex(secret_key_hex);
    return getPublicKey(bytes);
};

export const nostr_secret_key_validate = (secret_key: string): string | undefined => {
    const trimmed = secret_key.trim();
    if (REGEX_NOSTR_KEY.test(trimmed)) return trimmed;
    const decoded = nostr_nsec_decode(trimmed);
    if (decoded) return decoded;
    return undefined;
};

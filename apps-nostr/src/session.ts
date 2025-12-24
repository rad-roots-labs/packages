import { nostr_public_key_from_secret, nostr_signer_nip07_get } from "@radroots/nostr";
import {
    dropSession,
    loginWithNip01,
    loginWithNip07,
    loginWithNip46,
    loginWithNip55,
    loginWithPubkey,
    pubkey,
} from "@welshman/app";

export type NostrLoginNip46Options = {
    pubkey: string;
    client_secret: string;
    signer_pubkey: string;
    relays: string[];
};

export type NostrLoginNip55Options = {
    pubkey: string;
    signer: string;
};

export const nostr_login_nip01 = (secret_key: string): string => {
    loginWithNip01(secret_key);
    return nostr_public_key_from_secret(secret_key);
};

export const nostr_login_nip07 = async (): Promise<string | undefined> => {
    const nip07 = nostr_signer_nip07_get();
    if (!nip07) return undefined;
    const pubkey_val = nip07.getPublicKey();
    if (!pubkey_val) return undefined;
    loginWithNip07(pubkey_val);
    return pubkey_val;
};

export const nostr_login_nip46 = (opts: NostrLoginNip46Options): void => {
    loginWithNip46(opts.pubkey, opts.client_secret, opts.signer_pubkey, opts.relays);
};

export const nostr_login_nip55 = (opts: NostrLoginNip55Options): void => {
    loginWithNip55(opts.pubkey, opts.signer);
};

export const nostr_login_pubkey = (pubkey_val: string): void => {
    loginWithPubkey(pubkey_val);
};

export const nostr_logout = (): void => {
    const pubkey_val = pubkey.get();
    if (pubkey_val) dropSession(pubkey_val);
};

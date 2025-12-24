import { getNip07, Nip01Signer, Nip07Signer, Nip46Broker, Nip46Signer, Nip55Signer } from "@welshman/signer";
import type { NostrSigner } from "./types/nostr.js";

export type NostrSignerNip46Options = {
    client_secret: string;
    signer_pubkey: string;
    relays: string[];
};

export type NostrSignerNip55Options = {
    signer: string;
    pubkey: string;
};

export const nostr_signer_nip01_create = (secret_key: string): NostrSigner => {
    return new Nip01Signer(secret_key);
};

export const nostr_signer_nip07_create = (): NostrSigner => {
    return new Nip07Signer();
};

export const nostr_signer_nip07_get = () => {
    return getNip07();
};

export const nostr_signer_nip46_create = (opts: NostrSignerNip46Options): NostrSigner => {
    const broker = new Nip46Broker({
        clientSecret: opts.client_secret,
        signerPubkey: opts.signer_pubkey,
        relays: opts.relays,
    });
    return new Nip46Signer(broker);
};

export const nostr_signer_nip55_create = (opts: NostrSignerNip55Options): NostrSigner => {
    return new Nip55Signer(opts.signer, opts.pubkey);
};

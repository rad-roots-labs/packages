import { get_store } from "$lib";
import { ndk, ndk_user } from "$lib/stores/ndk";
import { NDKNip07Signer, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";

export type NostrLoginOptionNip05 = {
    nip07: true;
};

export type NostrLoginOptionNostrKey = {
    nostr_key: Uint8Array | string;
};

export type NostrLoginOptions =
    | NostrLoginOptionNip05
    | NostrLoginOptionNostrKey


export const nostr_logout = async (): Promise<void> => {
    const ndk_val = get_store(ndk);
    ndk_val.activeUser = undefined;
    document.cookie = "radroots_npub=";
    console.log(`logged out (nostr)`)

};

export const nostr_login = async (opts: NostrLoginOptions): Promise<void> => {
    const ndk_val = get_store(ndk);
    let user: NDKUser | null = null;
    if (`nip07` in opts) {
        const signer = new NDKNip07Signer();
        ndk_val.signer = signer;
        user = await ndk_val.signer.user();
        user.ndk = ndk_val;
    } else if (`nostr_key` in opts) {
        const signer = new NDKPrivateKeySigner(opts.nostr_key);
        ndk_val.signer = signer;
        user = await ndk_val.signer.user();
        user.ndk = ndk_val;
    }
    if (!user) return;
    ndk_user.set(user);
    ndk_val.activeUser = user;
};

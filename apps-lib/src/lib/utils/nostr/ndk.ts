import { NDKPrivateKeySigner, type NDKUser } from "@nostr-dev-kit/ndk";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { throw_err } from "@radroots/utils";

export const ndk_init = async (ndk: NDKSvelte, secret_key: string): Promise<NDKUser> => {
    const signer = new NDKPrivateKeySigner(secret_key);
    ndk.signer = signer;
    const user = await signer.user();
    if (!user) throw_err("*-user");
    user.ndk = ndk;
    return user;
};
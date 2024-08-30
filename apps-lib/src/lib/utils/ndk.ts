import NDK, { NDKEvent, NDKPrivateKeySigner, NDKUser } from '@nostr-dev-kit/ndk';
import { time_now_ms } from "./client";

export async function ndk_setup_privkey(opts: {
    $ndk: NDK;
    private_key: string;
}): Promise<NDKUser | undefined> {
    try {
        const { $ndk: ndk, private_key } = opts;
        const signer = new NDKPrivateKeySigner(private_key);
        ndk.signer = signer;

        const user = await signer.user();
        if (user) {
            user.ndk = ndk;
            return user;
        }
    } catch (e) { }
};

export async function ndk_event(opts: {
    $ndk: NDK;
    $ndk_user: NDKUser;
    basis: {
        kind: number;
        content: string;
        tags?: string[][];
    }
}): Promise<NDKEvent | undefined> {
    try {
        const { $ndk: ndk, $ndk_user: ndk_user, basis } = opts;
        const time_now = time_now_ms();

        const tags: string[][] = [
            ['published_at', time_now.toString()],
        ];

        for (const tag of basis.tags || []) {
            tags.push(tag);
        };

        const event: NDKEvent = new NDKEvent(ndk, {
            kind: basis.kind,
            pubkey: ndk_user.pubkey,
            content: basis.content,
            created_at: time_now,
            tags
        });
        return event;
    } catch (e) { };
};

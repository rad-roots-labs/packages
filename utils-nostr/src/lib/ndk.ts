import { INostrClassified, INostrFollow, INostrJobRequest, NostrEventTags, tags_classified, tags_follow_list, tags_job_request, time_now_ms, type INostrMetadata } from '$root';
import NDK, { NDKEvent, NDKKind, NDKPrivateKeySigner, NDKUser } from '@nostr-dev-kit/ndk';

export type NDKEventFigure<T extends object> = {
    $ndk: NDK;
    $ndk_user: NDKUser;
} & T;

export const ndk_init = async (opts: {
    $ndk: NDK;
    secret_key: string;
}): Promise<NDKUser | undefined> => {
    try {
        const { $ndk: ndk, secret_key } = opts;
        const signer = new NDKPrivateKeySigner(secret_key);
        ndk.signer = signer;
        const user = await signer.user();
        if (user) {
            user.ndk = ndk;
            return user;
        }
    } catch (e) {
        console.log(`(error) ndk_init `, e);
    };
};

export const ndk_event = async (opts: NDKEventFigure<{
    basis: {
        kind: number;
        content: string;
        tags?: NostrEventTags;
    }
}>): Promise<NDKEvent | undefined> => {
    try {
        const { $ndk: ndk, $ndk_user: ndk_user, basis } = opts;
        console.log(JSON.stringify(basis, null, 4), `basis`)
        const time_now = time_now_ms();
        const tags: NostrEventTags = [
            ['published_at', time_now.toString()],
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

export const ndk_event_metadata = async (opts: NDKEventFigure<{
    metadata: INostrMetadata
}>): Promise<NDKEvent | undefined> => {
    const { $ndk, $ndk_user, metadata: data } = opts;
    return await ndk_event({
        $ndk,
        $ndk_user,
        basis: {
            kind: 0,
            content: JSON.stringify(data),
        },
    });
};

export const ndk_event_follows = async (opts: NDKEventFigure<{
    list: INostrFollow[];
}>): Promise<NDKEvent | undefined> => {
    const { $ndk, $ndk_user, list: data } = opts;
    return await ndk_event({
        $ndk,
        $ndk_user,
        basis: {
            kind: 3,
            content: ``,
            tags: tags_follow_list(data),
        },
    });
};

export const ndk_event_classified = async (opts: NDKEventFigure<{
    classified: INostrClassified;
}>): Promise<NDKEvent | undefined> => {
    const { $ndk, $ndk_user, classified: data } = opts;
    return await ndk_event({
        $ndk,
        $ndk_user,
        basis: {
            kind: NDKKind.Classified,
            content: ``,
            tags: tags_classified(data),
        },
    });
};

export const ndk_event_job_request = async (opts: NDKEventFigure<{
    data: INostrJobRequest;
}>): Promise<NDKEvent | undefined> => {
    const { $ndk, $ndk_user, data } = opts;
    return await ndk_event({
        $ndk,
        $ndk_user,
        basis: {
            kind: NDKKind.DVMReqDiscoveryNostrContent,
            content: ``,
            tags: tags_job_request(data)
        },
    });
};

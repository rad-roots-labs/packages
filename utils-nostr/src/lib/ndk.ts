import { INostrClassified, INostrComment, INostrFollow, INostrJobRequest, INostrReaction, NostrEventTags, tags_classified, tags_comment, tags_follow_list, tags_job_request, tags_reaction, time_now_ms, type INostrMetadata } from '$root';
import NDK, { NDKCacheAdapter, NDKEvent, NDKKind, NDKPrivateKeySigner, NDKUser } from '@nostr-dev-kit/ndk';

export type NDKEventFigure<T extends object> = {
    ndk: NDK;
    ndk_user: NDKUser;
    date_published?: Date;
} & T;

export const create_ndk = (explicitRelayUrls: string[], cacheAdapter?: NDKCacheAdapter): NDK => {
    return new NDK({
        explicitRelayUrls,
        enableOutboxModel: false,
        cacheAdapter
    });
};

export const create_ndk_signer = (secret_key: string): NDKPrivateKeySigner => {
    return new NDKPrivateKeySigner(secret_key);
};

export const ndk_init = async (opts: {
    ndk: NDK;
    secret_key: string;
}): Promise<NDKUser | undefined> => {
    try {
        const { ndk, secret_key } = opts;
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

export const ndk_event_metadata = async (opts: NDKEventFigure<{
    data: INostrMetadata
}>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: 0,
            content: JSON.stringify(data),
        },
    });
};

export const ndk_event_follows = async (opts: NDKEventFigure<{
    data: INostrFollow;
}>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: 3,
            content: ``,
            tags: tags_follow_list(data.list),
        },
    });
};

export const ndk_event_classified = async (opts: NDKEventFigure<{
    data: INostrClassified;
}>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
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
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.DVMReqDiscoveryNostrContent,
            content: ``,
            tags: tags_job_request(data)
        },
    });
};

export const ndk_event_reaction = async (opts: NDKEventFigure<{
    data: INostrReaction;
}>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.Reaction,
            content: data.content,
            tags: tags_reaction(data)
        },
    });
};

export const ndk_event_comment = async (opts: NDKEventFigure<{
    data: INostrComment;
}>): Promise<NDKEvent | undefined> => {
    const { ndk, ndk_user, data } = opts;
    return await ndk_event({
        ndk,
        ndk_user,
        basis: {
            kind: NDKKind.GenericReply,
            content: data.content,
            tags: tags_comment(data)
        },
    });
};


import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { NostrEventTags } from "../types/lib.js";
import { NDKEventFigure } from "../types/ndk.js";
import { time_now_ms } from "../utils/lib.js";


export const get_event_tag = (tags: NDKTag[], key: string): string => tags.find(t => t[0] === key)?.[1] ?? '';
export const get_event_tags = (tags: NDKTag[], key: string): NDKTag[] => tags.filter(t => t[0] === key);

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
import { NDKTag } from "@nostr-dev-kit/ndk";

export const get_event_tag = (tags: NDKTag[], key: string): string => tags.find(t => t[0] === key)?.[1] ?? '';
export const get_event_tags = (tags: NDKTag[], key: string): NDKTag[] => tags.filter(t => t[0] === key);

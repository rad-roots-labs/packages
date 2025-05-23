import { NDKEvent } from "@nostr-dev-kit/ndk";

export type NostrNdkEvent = NDKEvent;
export type NostrEventTag = string[];
export type NostrEventTags = NostrEventTag[];
export type ErrorMessage<T extends string> = { err: T };
export type ResolveError<T> = T | ErrorMessage<string>;
export type NostrEventReferenced = {
    id: string;
    kind: number;
    author: string;
    relays?: string[];
    d_tag?: string;
}
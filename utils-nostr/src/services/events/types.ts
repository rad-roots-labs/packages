import type { INostrClassified, INostrEventEventSign, INostrFollow, INostrMetadata, ResolveError } from "$root";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { type NostrEvent as NostrToolsEvent } from "nostr-tools";

export type INostrEventServiceNeventEncode = {
    id: string;
    relays: string[];
    author: string;
    kind: number;
};

export type INostrEventServiceEventResolve = ResolveError<NDKEvent>;

export type INostrEventService = {
    first_tag_value(event: NDKEvent, tag_name: string): string;
    nostr_event_sign: (opts: INostrEventEventSign) => NostrToolsEvent;
    nostr_event_sign_attest: (secret_key: string) => NostrToolsEvent;
    nostr_event_verify_serialized: (event_serialized: string) => boolean;
    nostr_event_verify: (event: NostrToolsEvent) => boolean;
    nevent_encode: (opts: INostrEventServiceNeventEncode) => string;
    metadata: (ndk: NDK, opts: INostrMetadata) => Promise<INostrEventServiceEventResolve>;
    follows: (ndk: NDK, opts: INostrFollow) => Promise<INostrEventServiceEventResolve>;
    classified: (ndk: NDK, opts: INostrClassified) => Promise<INostrEventServiceEventResolve>;
};

import NDK, { NDKUser } from "@nostr-dev-kit/ndk";
import { type NostrEventTagClient } from "./lib.js";

export type NDKEventFigure<T extends object> = {
    ndk: NDK;
    ndk_user: NDKUser;
    date_published?: Date;
    client?: NostrEventTagClient;
} & T;


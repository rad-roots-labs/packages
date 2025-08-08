import NDK, { NDKUser } from "@nostr-dev-kit/ndk";

export type NDKEventFigure<T extends object> = {
    ndk: NDK;
    ndk_user: NDKUser;
    date_published?: Date;
} & T;


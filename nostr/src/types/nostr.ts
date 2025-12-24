import type { Pool, Repository, Tracker } from "@welshman/net";
import type { ISigner } from "@welshman/signer";
import type { SignedEvent, TrustedEvent } from "@welshman/util";
import type { NostrEventTagClient } from "./lib.js";

export type NostrEvent = TrustedEvent;
export type NostrSignedEvent = SignedEvent;
export type NostrSigner = ISigner;

export type NostrContext = {
    pool: Pool;
    repository: Repository;
    tracker: Tracker;
};

export type NostrEventFigure<T extends object> = {
    signer: NostrSigner;
    date_published?: Date;
    client?: NostrEventTagClient;
} & T;

export type NostrUser = {
    pubkey: string;
};

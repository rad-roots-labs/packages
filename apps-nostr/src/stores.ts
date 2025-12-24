import type { NostrUser } from "@radroots/nostr";
import type { Session, SignerLogEntry } from "@welshman/app";
import { pubkey, repository, session, sessions, signer, signerLog, tracker } from "@welshman/app";
import type { Repository, Tracker } from "@welshman/net";
import type { ISigner } from "@welshman/signer";
import type { ReadableWithGetter, WritableWithGetter } from "@welshman/store";
import { derived, type Readable } from "svelte/store";

export const nostr_pubkey: WritableWithGetter<string | undefined> = pubkey;
export const nostr_sessions: WritableWithGetter<Record<string, Session>> = sessions;
export const nostr_session: ReadableWithGetter<Session | undefined> = session;
export const nostr_signer: ReadableWithGetter<ISigner | undefined> = signer;
export const nostr_signer_log: WritableWithGetter<SignerLogEntry[]> = signerLog;
export const nostr_repository: Repository = repository;
export const nostr_tracker: Tracker = tracker;

export const nostr_user: Readable<NostrUser | undefined> = derived(
    pubkey,
    pubkey_val => (pubkey_val ? { pubkey: pubkey_val } : undefined),
);

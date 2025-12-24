import { Pool, Repository, Tracker } from "@welshman/net";
import type { TrustedEvent } from "@welshman/util";
import type { NostrContext } from "./types/nostr.js";

export type NostrContextOptions = {
    pool?: Pool;
    repository?: Repository;
    tracker?: Tracker;
};

export const nostr_pool_create = (): Pool => {
    return new Pool();
};

export const nostr_pool_get = (): Pool => {
    return Pool.get();
};

export const nostr_repository_create = (): Repository => {
    return new Repository();
};

export const nostr_repository_get = (): Repository => {
    return Repository.get();
};

export const nostr_tracker_create = (): Tracker => {
    return new Tracker();
};

export const nostr_context_create = (opts?: NostrContextOptions): NostrContext => {
    return {
        pool: opts?.pool ?? nostr_pool_create(),
        repository: opts?.repository ?? nostr_repository_create(),
        tracker: opts?.tracker ?? nostr_tracker_create(),
    };
};

export const nostr_context_default = (): NostrContext => {
    return {
        pool: nostr_pool_get(),
        repository: nostr_repository_get(),
        tracker: nostr_tracker_create(),
    };
};

export const nostr_repository_dump = (repository: Repository): TrustedEvent[] => {
    return repository.dump();
};

export const nostr_repository_load = (repository: Repository, events: TrustedEvent[]): void => {
    repository.load(events);
};

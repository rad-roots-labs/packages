import {
    makeLoader as make_loader,
    publish as publish_events,
    request as request_events,
    type AdapterContext,
    type LoadOptions,
    type PublishOptions,
    type PublishResultsByRelay,
    type RequestOptions,
} from "@welshman/net";
import type { TrustedEvent } from "@welshman/util";
import type { NostrContext } from "./types/nostr.js";

const build_adapter_context = (context?: NostrContext): AdapterContext | undefined => {
    if (!context) return undefined;
    return {
        pool: context.pool,
        repository: context.repository,
    };
};

export type NostrRequestOptions = Omit<RequestOptions, "context"> & {
    context?: NostrContext;
};

export type NostrPublishOptions = Omit<PublishOptions, "context"> & {
    context?: NostrContext;
};

export type NostrLoadOptions = LoadOptions & {
    context?: NostrContext;
};

export const nostr_request = async (opts: NostrRequestOptions): Promise<TrustedEvent[]> => {
    const { context, ...rest } = opts;
    const adapter_context = build_adapter_context(context);
    return request_events({ ...rest, context: adapter_context });
};

export const nostr_load = async (opts: NostrLoadOptions): Promise<TrustedEvent[]> => {
    const { context, ...rest } = opts;
    const adapter_context = build_adapter_context(context);
    const loader = make_loader({ delay: 200, timeout: 3000, threshold: 0.5, context: adapter_context });
    return loader(rest);
};

export const nostr_publish = async (opts: NostrPublishOptions): Promise<PublishResultsByRelay> => {
    const { context, ...rest } = opts;
    const adapter_context = build_adapter_context(context);
    return publish_events({ ...rest, context: adapter_context });
};

export const nostr_relays_open = (context: NostrContext, relays: string[]): void => {
    for (const relay of relays) context.pool.get(relay).open();
};

export const nostr_relays_close = (context: NostrContext, relays: string[]): void => {
    for (const relay of relays) context.pool.remove(relay);
};

export const nostr_relays_clear = (context: NostrContext): void => {
    context.pool.clear();
};

export * from "./relay/lib.js";

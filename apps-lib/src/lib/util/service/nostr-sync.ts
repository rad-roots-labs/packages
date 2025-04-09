import { get_store, handle_err, ndk, ndk_user } from "$root";
import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import type NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { ndk_event_metadata, type INostrMetadata } from "@radroots/nostr-util";
import { err_msg, type ErrorMessage } from "@radroots/util";

export type INostrSyncServiceMetadata = {
    metadata: INostrMetadata;
};

export type INostrSyncService = {
    metadata: (opts: INostrSyncServiceMetadata) => Promise<NDKEvent | ErrorMessage<string>>;
};

export class NostrSyncService implements INostrSyncService {
    constructor() { }

    private config = (): { $ndk: NDKSvelte; $ndk_user: NDKUser } => {
        const $ndk = get_store(ndk);
        const $ndk_user = get_store(ndk_user);
        return { $ndk, $ndk_user };
    }

    public metadata = async (opts: INostrSyncServiceMetadata): Promise<NDKEvent | ErrorMessage<string>> => {
        try {
            const { $ndk, $ndk_user } = this.config();
            const { metadata } = opts;
            const ev = await ndk_event_metadata({
                $ndk,
                $ndk_user,
                metadata,
            });
            if (ev) return ev;
            return err_msg(`error.nostr.sync.metadata.missing_event`);
        } catch (e) {
            await handle_err(e, `metadata`);
            return err_msg(`error.nostr.sync.failure`); //@todo
        }
    }
}
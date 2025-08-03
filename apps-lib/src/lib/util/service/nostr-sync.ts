import { get_store, handle_err, ndk, ndk_user } from "$root";
import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import type NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { err_msg, type ErrorMessage } from "@radroots/util";
import { ndk_event_metadata, type INostrMetadata } from "@radroots/utils-nostr";

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
            const { $ndk: ndk, $ndk_user: ndk_user } = this.config();
            const { metadata: data } = opts;
            const ev = await ndk_event_metadata({
                ndk,
                ndk_user,
                data,
            });
            if (ev) return ev;
            return err_msg(`error.nostr.sync.metadata.missing_event`);
        } catch (e) {
            await handle_err(e, `metadata`);
            return err_msg(`error.nostr.sync.failure`); //@todo
        }
    }
}

export const nostr_sync = new NostrSyncService();
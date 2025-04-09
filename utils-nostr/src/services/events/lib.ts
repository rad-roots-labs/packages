import { INostrClassified, INostrEventEventSign, INostrEventService, INostrEventServiceEventResolve, INostrEventServiceNeventEncode, INostrFollow, INostrMetadata, lib_nostr_event_sign, lib_nostr_event_sign_attest, lib_nostr_event_verify, lib_nostr_event_verify_serialized, lib_nostr_nevent_encode, ndk_event, ndk_event_classified, ndk_event_follows } from "$root";
import NDK, { NDKKind, NDKUser, type NDKEvent } from "@nostr-dev-kit/ndk";
import { err_msg, ErrorMessage } from "@radroots/util";
import { type NostrEvent as NostrToolsEvent } from "nostr-tools";

export class NostrEventService implements INostrEventService {
    private resolve_ndk_user = async (ndk: NDK): Promise<NDKUser | ErrorMessage<string>> => {
        const user = await ndk.signer?.user();
        if (!user) return err_msg(`error.ndk.user_undefined`);
        return user;
    }

    private resolve_ndk_event = (ev?: NDKEvent) => {
        if (!ev) return err_msg(`error.event_undefined`);
        return ev;
    }

    public first_tag_value = (event: NDKEvent, tag_name: string): string => {
        const tag = event.getMatchingTags(tag_name)[0];
        return tag ? tag[1] : "";
    }

    public nostr_event_sign = (opts: INostrEventEventSign): NostrToolsEvent => {
        return lib_nostr_event_sign(opts);
    };

    public nostr_event_sign_attest = (secret_key: string): NostrToolsEvent => {
        return lib_nostr_event_sign_attest(secret_key);
    };

    public nostr_event_verify = (event: NostrToolsEvent): boolean => {
        return lib_nostr_event_verify(event);
    };

    public nostr_event_verify_serialized = (event_serialized: string): boolean => {
        const result = lib_nostr_event_verify_serialized(event_serialized);
        return !!result;
    };

    public nevent_encode = (opts: INostrEventServiceNeventEncode): string => {
        return lib_nostr_nevent_encode(opts);
    };

    public metadata = async ($ndk: NDK, opts: INostrMetadata): Promise<INostrEventServiceEventResolve> => {
        const $ndk_user = await this.resolve_ndk_user($ndk);
        if (`err` in $ndk_user) return $ndk_user;
        const ev = await ndk_event({
            $ndk,
            $ndk_user,
            basis: {
                kind: NDKKind.Metadata,
                content: JSON.stringify(opts),
            },
        });
        return this.resolve_ndk_event(ev);
    }

    public follows = async ($ndk: NDK, list: INostrFollow[]): Promise<INostrEventServiceEventResolve> => {
        const $ndk_user = await this.resolve_ndk_user($ndk);
        if (`err` in $ndk_user) return $ndk_user;
        const ev = await ndk_event_follows({
            $ndk,
            $ndk_user,
            list
        });
        return this.resolve_ndk_event(ev);
    }

    public classified = async ($ndk: NDK, classified: INostrClassified): Promise<INostrEventServiceEventResolve> => {
        const $ndk_user = await this.resolve_ndk_user($ndk);
        if (`err` in $ndk_user) return $ndk_user;
        const ev = await ndk_event_classified({
            $ndk,
            $ndk_user,
            classified
        });
        return this.resolve_ndk_event(ev);
    }
}


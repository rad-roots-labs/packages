import { type CallbackPromiseGeneric, type ModelLocationGcs, type ModelNostrProfile, type ModelNostrRelay } from "$lib";

export type ISearchResultDisplayCallbacks = {
    lc_handle_result_location_gcs: CallbackPromiseGeneric<ModelLocationGcs>;
    lc_handle_result_nostr_profile: CallbackPromiseGeneric<ModelNostrProfile>;
    lc_handle_result_nostr_relay: CallbackPromiseGeneric<ModelNostrRelay>;
}
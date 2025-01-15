import type { CallbackPromiseGeneric } from "./app";
import type { ModelLocationGcs, ModelNostrProfile, ModelNostrRelay } from "./model";

export type ISearchResultDisplayCallbacks = {
    lc_handle_result_location_gcs: CallbackPromiseGeneric<ModelLocationGcs>;
    lc_handle_result_nostr_profile: CallbackPromiseGeneric<ModelNostrProfile>;
    lc_handle_result_nostr_relay: CallbackPromiseGeneric<ModelNostrRelay>;
}
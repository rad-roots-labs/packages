<script lang="ts">
    import { Glyph, lls, SearchResultContainer } from "$root";
    import {
        ascii,
        type CallbackPromiseGeneric,
        type ResolveGeolocationInfo,
        type ResolveProfileInfo,
        type SearchServiceResult,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: {
            result: SearchServiceResult;
            lc_handle_search_geolocation: CallbackPromiseGeneric<ResolveGeolocationInfo>;
            lc_handle_search_profile: CallbackPromiseGeneric<ResolveProfileInfo>;
            lc_handle_search_nostr_relay: CallbackPromiseGeneric<{
                id: string;
            }>;
        };
    } = $props();
</script>

{#if `location_gcs` in basis.result && basis.result.location_gcs.id}
    <SearchResultContainer
        basis={{
            callback: async () => {
                await basis.lc_handle_search_geolocation(
                    basis.result.location_gcs,
                );
            },
        }}
    >
        <div class={`flex flex-row gap-4 justify-start items-center`}>
            <div
                class={`flex flex-row h-[1.5rem] w-[1.5rem] justify-center items-center bg-stone-500 round-24`}
            >
                <Glyph
                    basis={{
                        classes: `text-white`,
                        dim: `xs`,

                        key: `compass`,
                    }}
                />
            </div>
            <div class={`flex flex-row gap-1 justify-start items-center`}>
                <div
                    class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-stone-600 rounded-md`}
                >
                    <p
                        class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                    >
                        {`${$lls(`common.location`)}`}
                    </p>
                </div>
                <p
                    class={`font-sans font-[700] text-layer-0-glyph/30 -translate-y-[1px]`}
                >
                    {ascii.bullet}
                </p>

                {#if basis.result.location_gcs.kind === `farm_land`}
                    <div
                        class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-lime-500 rounded-md`}
                    >
                        <p
                            class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                        >
                            {`${$lls(`common.farm_land`)}`}
                        </p>
                    </div>
                {/if}
            </div>
        </div>
        <div
            class={`flex flex-row flex-grow pl-4 pr-2 justify-end items-center overflow-hidden`}
        >
            {#if basis.result.location_gcs.label}
                <p
                    class={`font-sand font-[500] text-[0.9rem] text-layer-0-glyph`}
                >
                    {`${basis.result.location_gcs.label}`}
                </p>
            {:else}
                <p
                    class={`font-sand font-[500] text-[0.9rem] text-layer-0-glyph truncate`}
                >
                    {`${basis.result.location_gcs.gc_name}, ${basis.result.location_gcs.gc_admin1_id}`}
                </p>
            {/if}
        </div>
    </SearchResultContainer>
{:else if `nostr_profile` in basis && basis.result.nostr_profile.id}
    <SearchResultContainer
        basis={{
            callback: async () => {
                await basis.lc_handle_search_profile(
                    basis.result.nostr_profile,
                );
            },
        }}
    >
        <div class={`flex flex-row gap-4 justify-start items-center`}>
            <div
                class={`flex flex-row h-[1.5rem] w-[1.5rem] justify-center items-center bg-blue-400 round-24`}
            >
                <Glyph
                    basis={{
                        classes: `text-white`,
                        dim: `xs`,

                        key: `user`,
                    }}
                />
            </div>
            <div class={`flex flex-row gap-1 justify-start items-center`}>
                <div
                    class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-stone-600 rounded-md`}
                >
                    <p
                        class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                    >
                        {`${$lls(`common.profile`)}`}
                    </p>
                </div>
                <p
                    class={`font-sans font-[700] text-layer-0-glyph/30 -translate-y-[1px]`}
                >
                    {ascii.bullet}
                </p>
                <div
                    class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-purple-400 rounded-md`}
                >
                    <p
                        class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                    >
                        {#if basis.result.result_k === `name`}
                            {`${$lls(`common.name`)}`}
                        {:else}
                            {`@todo`}
                        {/if}
                    </p>
                </div>
            </div>
        </div>
        <div
            class={`flex flex-row flex-grow pl-4 pr-2 justify-end items-center overflow-hidden`}
        >
            {#if basis.result.nostr_profile.name}
                <p
                    class={`font-sand font-[500] text-[0.9rem] text-layer-0-glyph tracking-wide truncate`}
                >
                    {#if basis.result.result_k === `name`}
                        {`${basis.result.nostr_profile.name}`}
                    {:else if basis.result.result_v}
                        {`${basis.result.result_v}`}
                    {:else}
                        {`@todo`}
                    {/if}
                </p>
            {/if}
        </div>
    </SearchResultContainer>
{:else if `nostr_relay` in basis && basis.result.nostr_relay.id}
    <SearchResultContainer
        basis={{
            callback: async () => {
                await basis.lc_handle_search_nostr_relay(
                    basis.result.nostr_relay,
                );
            },
        }}
    >
        <div class={`flex flex-row gap-4 justify-start items-center`}>
            <div
                class={`flex flex-row h-[1.5rem] w-[1.5rem] justify-center items-center bg-blue-400 round-24`}
            >
                <Glyph
                    basis={{
                        classes: `text-white`,
                        dim: `xs`,

                        key: `user`,
                    }}
                />
            </div>
            <div class={`flex flex-row gap-1 justify-start items-center`}>
                <div
                    class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-stone-600 rounded-md`}
                >
                    <p
                        class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                    >
                        {`${$lls(`common.relay`)}`}
                    </p>
                </div>
                <p
                    class={`font-sans font-[700] text-layer-0-glyph/30 -translate-y-[1px]`}
                >
                    {ascii.bullet}
                </p>
                <div
                    class={`flex flex-row h-[1.2rem] px-2 justify-center items-center bg-yellow-400 rounded-md`}
                >
                    <p
                        class={`font-sans font-[900] text-[0.7rem] text-white uppercase`}
                    >
                        {`${$lls(`common.url`)}`}
                    </p>
                </div>
            </div>
        </div>
        <div
            class={`flex flex-row flex-grow pr-2 justify-end items-center overflow-hidden`}
        >
            <p
                class={`font-sand font-[500] text-[0.9rem] text-layer-0-glyph tracking-wide truncate`}
            >
                {`${basis.result.nostr_relay.url}`}
            </p>
        </div>
    </SearchResultContainer>
{/if}

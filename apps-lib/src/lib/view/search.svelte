<script lang="ts">
    import {
        fmt_id,
        Glyph,
        handle_err,
        Input,
        kv_init_page,
        LayoutPage,
        LayoutView,
        lls,
        NavigationTabs,
        PageToolbar,
        SearchResultDisplay,
    } from "$root";
    import {
        cfg_app,
        debounce_callback,
        SearchService,
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type IViewBasis,
        type IViewSearchData,
        type ResolveGeolocationInfo,
        type ResolveProfileInfo,
        type SearchServiceResult,
    } from "@radroots/util";
    import { onDestroy, onMount } from "svelte";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: IViewSearchData;
            lc_handle_back: CallbackPromise;
            lc_handle_search_geolocation: CallbackPromiseGeneric<ResolveGeolocationInfo>;
            lc_handle_search_profile: CallbackPromiseGeneric<ResolveProfileInfo>;
            lc_handle_search_nostr_relay: CallbackPromiseGeneric<{
                id: string;
            }>;
        }>;
    } = $props();

    $effect(() => {
        console.log(JSON.stringify(basis.data, null, 4), `basis.data`);
    });

    let search_service: SearchService | undefined = undefined;
    let search_val = $state(``);
    let search_results: SearchServiceResult[] = $state([]);

    onMount(async () => {
        try {
            search_val = ``;
            if (!basis.kv_init_prevent) await kv_init_page();
            if (basis.lc_on_mount) await basis.lc_on_mount();
            search_service = new SearchService(basis.data);
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const handle_search_input = debounce_callback((val: string) => {
        console.log(`val `, val);
        if (search_service) search_results = search_service.search(val);
    }, cfg_app.debounce.search);

    onDestroy(async () => {
        try {
            if (basis.lc_on_destroy) await basis.lc_on_destroy();
        } catch (e) {
            handle_err(e, `on_destroy`);
        }
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: { label: `${$lls(`common.search`)}` },
            callback: basis.lc_handle_back,
        }}
    />
    <LayoutPage>
        <div
            class={`relative flex flex-row w-full justify-center items-center bg-layer-1-surface rounded-2xl`}
        >
            <Glyph
                basis={{
                    classes: `absolute left-4 text-layer-0-glyph-shade`,
                    dim: `sm`,

                    key: `magnifying-glass`,
                }}
            />
            <Input
                bind:value={search_val}
                basis={{
                    id: fmt_id(`search`),
                    sync: true,
                    classes: `pl-12 text-layer-0-glyph`,
                    placeholder: `Enter search query`,
                    callback: async ({ value }) => handle_search_input(value),
                }}
            />
        </div>
        <div class={`flex flex-col w-full gap-4 justify-center items-center`}>
            {#each search_results as li (li.id)}
                <SearchResultDisplay
                    basis={{
                        result: li,
                        lc_handle_search_geolocation:
                            basis.lc_handle_search_geolocation,
                        lc_handle_search_profile:
                            basis.lc_handle_search_profile,
                        lc_handle_search_nostr_relay:
                            basis.lc_handle_search_nostr_relay,
                    }}
                />
            {/each}
        </div>
    </LayoutPage>
</LayoutView>
<NavigationTabs />

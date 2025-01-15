<script lang="ts">
    import {
        cfg_app,
        debounce_input,
        FloatTabs,
        fmt_id,
        Glyph,
        Input,
        kv_init_page,
        LayoutView,
        lls,
        PageToolbar,
        SearchResultDisplay,
        SearchService,
        type ISearchLoadData,
        type ISearchResultDisplayCallbacks,
        type SearchServiceResult,
        type ViewBasisLoadData,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    type LoadData = ISearchLoadData;

    export let basis: ViewBasisLoadData<
        ISearchResultDisplayCallbacks & {},
        LoadData
    >;
    let load_data: LoadData = undefined;

    let client_search: SearchService | undefined = undefined;
    let search_val = ``;
    let search_results: SearchServiceResult[] = [];

    onMount(async () => {
        search_val = ``;
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        load_data = await basis.lc_load_data();
        if (load_data) client_search = new SearchService(load_data);
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });

    const handle_search_input = debounce_input((val: string) => {
        if (client_search) search_results = client_search.search(val);
    }, cfg_app.debounce.search);
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: { label: `${$lls(`common.search`)}` },
            callback: basis.lc_handle_back,
        }}
    />
    <div class={`flex flex-col w-full px-4 gap-6 justify-center items-center`}>
        <div
            class={`relative flex flex-row w-full justify-center items-center bg-layer-1-surface rounded-2xl`}
        >
            <Glyph
                basis={{
                    classes: `absolute left-4 text-layer-0-glyph-shade`,
                    dim: `sm`,
                    weight: `bold`,
                    key: `magnifying-glass`,
                }}
            ></Glyph>
            <Input
                bind:value={search_val}
                basis={{
                    id: fmt_id(`search`),
                    sync: true,
                    classes: `pl-12 text-layer-0-glyph`,
                    placeholder: `Enter search query`,
                    callback: async ({ value }) => handle_search_input(value),
                }}
            ></Input>
        </div>
        <div class={`flex flex-col w-full gap-4 justify-center items-center`}>
            {#each search_results as li (li.id)}
                <SearchResultDisplay
                    basis={{
                        result: li,
                        lc_handle_result_location_gcs:
                            basis.lc_handle_result_location_gcs,
                        lc_handle_result_nostr_profile:
                            basis.lc_handle_result_nostr_profile,
                        lc_handle_result_nostr_relay:
                            basis.lc_handle_result_nostr_relay,
                    }}
                />
            {/each}
        </div>
    </div>
</LayoutView>
<FloatTabs />

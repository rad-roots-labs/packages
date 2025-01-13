<script lang="ts" generics="TLocationGcs extends ModelLocationGcs">
    import {
        Fade,
        FloatTabs,
        geol_lat_fmt,
        geol_lng_fmt,
        GlyphButtonSimple,
        kv_init_page,
        LayoutView,
        lls,
        MapPointDisplay,
        PageToolbar,
        type CallbackPromise,
        type IFarmLoadData,
        type ModelLocationGcs,
        type ViewBasisLoadData,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";
    type LoadData = IFarmLoadData<TLocationGcs>;

    export let basis: ViewBasisLoadData<
        {
            lc_handle_farm_land_add: CallbackPromise;
            lc_handle_farm_land_view: CallbackPromise;
        },
        LoadData
    >;
    let load_data: LoadData = undefined;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        load_data = await basis.lc_load_data();
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: { label: `${$lls(`common.farm_land`)}` },
        }}
    >
        <div
            slot="header-option"
            class={`flex flex-row justify-start items-center`}
        >
            <Fade>
                <GlyphButtonSimple
                    basis={{
                        label: `${$lls(`common.add`)}`,
                        callback: basis.lc_handle_farm_land_add,
                    }}
                ></GlyphButtonSimple>
            </Fade>
        </div>
    </PageToolbar>
    <div
        class={`flex flex-col w-full pt-2 px-4 gap-5 justify-start items-center`}
    >
        {#if load_data && load_data.location_gcs.length}
            {#each load_data.location_gcs.filter((i) => i.kind === `farm_land`) as li}
                <button
                    class={`group flex flex-row h-[5rem] w-full px-8 gap-8 justify-start items-center bg-layer-1-surface layer-1-active-surface round-36 el-re`}
                    on:click={basis.lc_handle_farm_land_view}
                >
                    <div
                        class={`flex flex-col h-[4rem] w-[4rem] justify-start items-center bg-layer-2-surface round-24`}
                    >
                        <MapPointDisplay
                            basis={{
                                point: {
                                    lat: li.lat,
                                    lng: li.lng,
                                },
                            }}
                        />
                    </div>
                    <div
                        class={`flex flex-col flex-grow h-[3.25rem] justify-between items-start`}
                    >
                        <div
                            class={`flex flex-row w-full justify-start items-center`}
                        >
                            <p
                                class={`font-sans font-[500] text-layer-0-glyph`}
                            >
                                {`${
                                    li.label ||
                                    `${geol_lat_fmt(
                                        li.lat,
                                        `d`,
                                        4,
                                    )}, ${geol_lng_fmt(li.lng, `d`, 4)}`
                                }`}
                            </p>
                        </div>
                        <div
                            class={`flex flex-row w-full gap-2 justify-start items-center`}
                        >
                            {#if li.kind === `farm_land`}
                                <div
                                    class={`flex flex-row h-5 px-2 justify-center items-center bg-layer-2-surface rounded-md`}
                                >
                                    <p
                                        class={`font-sans font-[700] text-[0.8rem] text-white`}
                                    >
                                        {`${$lls(`common.farm`)}`}
                                    </p>
                                </div>
                            {/if}
                            <p
                                class={`font-sansd font-[500] text-layer-0-glyph`}
                            >
                                {`${li.gc_name}, ${li.gc_admin1_id}, ${li.gc_country_id}`}
                            </p>
                        </div>
                    </div>
                </button>
            {/each}
        {:else}
            <div class={`flex flex-col w-full justify-center items-center`}>
                <div class={`flex flex-row w-full justify-center items-center`}>
                    <button
                        class={`flex flex-row justify-center items-center`}
                        on:click={basis.lc_handle_farm_land_add}
                    >
                        <p
                            class={`font-sans font-[400] text-lg text-layer-0-glyph`}
                        >
                            {`- Add land -`}
                        </p>
                    </button>
                </div>
            </div>
        {/if}
    </div>
</LayoutView>
<FloatTabs />

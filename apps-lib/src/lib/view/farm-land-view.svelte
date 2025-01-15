<script lang="ts">
    import {
        app_notify,
        GlyphButtonSimple,
        kv_init_page,
        LayoutView,
        lls,
        MapPointDisplay,
        PageToolbar,
        qp_id,
        type IFarmViewLoadData,
        type ViewBasisLoadData,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";
    type LoadData = IFarmViewLoadData;

    export let basis: ViewBasisLoadData<{}, LoadData>;
    let load_data: LoadData = undefined;

    onMount(async () => {
        if (!basis.kv_init_prevent) await kv_init_page();
        if (basis.lc_on_mount) await basis.lc_on_mount();
        if (!$qp_id)
            return void app_notify.set(
                `${$lls(`error.page.load.query_param`)}`,
            );
        load_data = await basis.lc_load_data();
    });

    onDestroy(async () => {
        if (basis.lc_on_destroy) await basis.lc_on_destroy();
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`icu.add_*`, { value: `${$lls(`common.farm_land`)}` })}`,
                callback_route: {
                    route: `/farm/land`,
                },
            },
        }}
    >
        <div
            slot="header-option"
            class={`flex flex-row gap-4 justify-start items-center`}
        >
            <GlyphButtonSimple
                basis={{
                    label: `${$lls(`common.edit`)}`,
                    callback: async () => {
                        alert(`@todo!`);
                    },
                }}
            />
        </div>
    </PageToolbar>
    {#if load_data?.location_gcs}
        <div class={`flex flex-col w-full px-4 justify-center items-center`}>
            <div
                class={`flex flex-row h-[20rem] w-full justify-center items-center bg-layer-2-surface round-44 overflow-hidden`}
            >
                <MapPointDisplay
                    basis={{
                        zoom: 12,
                        point: {
                            lat: load_data.location_gcs.lat,
                            lng: load_data.location_gcs.lng,
                        },
                    }}
                />
            </div>
            <div class={`flex flex-col w-full justify-center items-center`}>
                <div class={`flex flex-row w-full justify-start items-center`}>
                    <p class={`font-sans font-[400] text-layer-0-glyph`}>hi</p>
                </div>
            </div>
        </div>
    {/if}
</LayoutView>

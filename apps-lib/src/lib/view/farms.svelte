<script lang="ts">
    import ButtonLabelDashed from "$lib/components/button/button-label-dashed.svelte";
    import {
        Fade,
        FarmsDisplayLiEl,
        GlyphButtonSimple,
        handle_err,
        kv_init_page,
        LayoutPage,
        LayoutView,
        lls,
        PageToolbar,
    } from "$root";
    import {
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type CallbackRoute,
        type IViewBasis,
        type LcGeocodeCallback,
        type ResolveFarmInfo,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data?: ResolveFarmInfo[];
            callback_route?: CallbackRoute<string>;
            lc_geocode: LcGeocodeCallback;
            lc_handle_farm_add: CallbackPromise;
            lc_handle_farm_view: CallbackPromiseGeneric<string>;
        }>;
    } = $props();

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await kv_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.farms`)}`,
                callback_route: basis.callback_route,
            },
        }}
    >
        {#snippet header_option()}
            {#if basis.data?.length}
                <Fade>
                    <GlyphButtonSimple
                        basis={{
                            label: `${$lls(`icu.add_*`, { value: `${$lls(`common.farm`)}` })}`,
                            callback: async () => {
                                await basis.lc_handle_farm_add();
                            },
                        }}
                    ></GlyphButtonSimple>
                </Fade>
            {/if}
        {/snippet}
    </PageToolbar>
    <LayoutPage>
        {#if basis.data?.length}
            {#each basis.data as li}
                <FarmsDisplayLiEl
                    basis={li}
                    lc_geocode={basis.lc_geocode}
                    lc_handle_farm_view={basis.lc_handle_farm_view}
                />
            {/each}
        {:else}
            <ButtonLabelDashed
                basis={{
                    label: `Add farm`,
                    callback: async () => {
                        await basis.lc_handle_farm_add();
                    },
                }}
            />
        {/if}
    </LayoutPage>
</LayoutView>

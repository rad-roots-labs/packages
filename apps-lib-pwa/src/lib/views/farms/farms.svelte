<script lang="ts">
    import ButtonLabelDashed from "$lib/components/buttons/button-label-dashed.svelte";
    import GlyphButtonSimple from "$lib/components/buttons/glyph-button-simple.svelte";
    import LayoutPage from "$lib/components/layouts/layout-page.svelte";
    import LayoutView from "$lib/components/layouts/layout-view.svelte";
    import PageToolbar from "$lib/components/navigation/page-toolbar.svelte";
    import FarmsDisplayLiEl from "$lib/features/farm/farms-display-li-el.svelte";
    import type { IViewBasis, IViewFarmsData } from "$lib/types/views";
    import { Fade, get_context, idb_init_page, type CallbackRoute } from "@radroots/apps-lib";
    import {
        handle_err,
        type CallbackPromise,
        type CallbackPromiseGeneric,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    const { ls } = get_context(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data?: IViewFarmsData;
            callback_route?: CallbackRoute<string>;
            on_handle_farm_add: CallbackPromise;
            on_handle_farm_view: CallbackPromiseGeneric<string>;
        }>;
    } = $props();

    onMount(async () => {
        try {
            if (!basis.kv_init_prevent) await idb_init_page();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$ls(`common.farms`)}`,
                callback_route: basis.callback_route,
            },
        }}
    >
        {#snippet header_option()}
            {#if basis.data?.list.length}
                <Fade>
                    <GlyphButtonSimple
                        basis={{
                            label: `${$ls(`icu.add_*`, { value: `${$ls(`common.farm`)}` })}`,
                            callback: async () => {
                                await basis.on_handle_farm_add();
                            },
                        }}
                    />
                </Fade>
            {/if}
        {/snippet}
    </PageToolbar>
    <LayoutPage>
        {#if basis.data}
            {#if basis.data?.list.length}
                {#each basis.data?.list || [] as li}
                    <FarmsDisplayLiEl
                        basis={li}
                        on_handle_farm_view={basis.on_handle_farm_view}
                    />
                {/each}
            {:else}
                <ButtonLabelDashed
                    basis={{
                        label: `Add farm`,
                        callback: async () => {
                            await basis.on_handle_farm_add();
                        },
                    }}
                />
            {/if}
        {/if}
    </LayoutPage>
</LayoutView>

<script lang="ts">
    import ButtonGlyphSimple from "$lib/components/button/button-glyph-simple.svelte";
    import ButtonLabelDashed from "$lib/components/button/button-label-dashed.svelte";
    import FarmsDisplayLiEl from "$lib/components/farm/farms-display-li-el.svelte";
    import LayoutPage from "$lib/components/layout/layout-page.svelte";
    import LayoutView from "$lib/components/layout/layout-view.svelte";
    import PageToolbar from "$lib/components/navigation/page-toolbar.svelte";
    import type { IViewBasis } from "$lib/types/views";
    import type { IViewFarmsData } from "$lib/types/views/farm";
    import {
        Fade,
        get_context,
        idb_kv_init_page,
        type CallbackRoute,
    } from "@radroots/apps-lib";
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
            if (!basis.kv_init_prevent) await idb_kv_init_page();
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
                    <ButtonGlyphSimple
                        basis={{
                            label: `${$ls(`icu.add_*`, {
                                value: `${$ls(`common.farm`)}`,
                            })}`,
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

<script lang="ts">
    import {
        ButtonLabelDashed,
        Fade,
        FarmsDisplayLiEl,
        GlyphButtonSimple,
        handle_err,
        idb_init_page,
        LayoutPage,
        LayoutView,
        PageToolbar,
    } from "$root";
    import {
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type CallbackRoute,
        type I18nTranslateFunction,
        type I18nTranslateLocale,
        type IViewBasis,
        type LcGeocodeCallback,
        type ResolveFarmInfo,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        ls,
        locale,
    }: {
        basis: IViewBasis<{
            data?: ResolveFarmInfo[];
            callback_route?: CallbackRoute<string>;
            lc_geocode: LcGeocodeCallback;
            lc_handle_farm_add: CallbackPromise;
            lc_handle_farm_view: CallbackPromiseGeneric<string>;
        }>;
        ls: I18nTranslateFunction;
        locale: I18nTranslateLocale;
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
            {#if basis.data?.length}
                <Fade>
                    <GlyphButtonSimple
                        basis={{
                            label: `${$ls(`icu.add_*`, { value: `${$ls(`common.farm`)}` })}`,
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
                    {ls}
                    {locale}
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

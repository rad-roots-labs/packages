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
        type CallbackRoute,
        type IViewFarmsData,
        type LcGeocodeCallback,
    } from "$root";
    import {
        type CallbackPromise,
        type CallbackPromiseGeneric,
        type I18nTranslateFunction,
        type I18nTranslateLocale,
        type IViewBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        ls,
        locale,
    }: {
        basis: IViewBasis<{
            data?: IViewFarmsData;
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
            {#if basis.data?.list.length}
                <Fade>
                    <GlyphButtonSimple
                        basis={{
                            label: `${$ls(`icu.add_*`, { value: `${$ls(`common.farm`)}` })}`,
                            callback: async () => {
                                await basis.lc_handle_farm_add();
                            },
                        }}
                    />
                </Fade>
            {/if}
        {/snippet}
    </PageToolbar>
    <LayoutPage>
        {#if basis.data?.list.length}
            {#each basis.data?.list as li}
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

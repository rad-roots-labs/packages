<script lang="ts">
    import {
        ButtonSimple,
        handle_err,
        kv_init_page,
        LayoutPage,
        LayoutView,
        lls,
        NavigationTabs,
        PageToolbar,
    } from "$root";
    import {
        type CallbackPromise,
        type IViewBasis,
        type ResolveAccountInfo,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data?: ResolveAccountInfo;
            lc_handle_farms: CallbackPromise;
            lc_handle_products: CallbackPromise;
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
                label: `${$lls(`common.general`)}`,
            },
        }}
    />
    <LayoutPage>
        <ButtonSimple
            basis={{
                label: `${$lls(`common.farms`)}`,
                callback: async () => {
                    await basis.lc_handle_farms();
                },
            }}
        />
        {#if basis.data?.farms?.length}
            <ButtonSimple
                basis={{
                    label: `${$lls(`common.products`)}`,
                    callback: async () => {
                        await basis.lc_handle_products();
                    },
                }}
            />
        {/if}
    </LayoutPage>
</LayoutView>
<NavigationTabs />

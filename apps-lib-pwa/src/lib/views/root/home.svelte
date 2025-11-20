<script lang="ts">
    import ButtonSimple from "$lib/components/button/button-simple.svelte";
    import LayoutPage from "$lib/components/layout/layout-page.svelte";
    import LayoutView from "$lib/components/layout/layout-view.svelte";
    import NavigationTabs from "$lib/components/navigation/navigation-tabs.svelte";
    import PageToolbar from "$lib/components/navigation/page-toolbar.svelte";
    import type { IViewBasis, IViewHomeData } from "$lib/types/views";
    import { get_context, idb_kv_init_page } from "@radroots/apps-lib";

    import { handle_err, type CallbackPromise } from "@radroots/utils";
    import { onMount } from "svelte";

    const { ls } = get_context(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data?: IViewHomeData;
            on_handle_farms: CallbackPromise;
            on_handle_products: CallbackPromise;
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

{#if basis.data}
    {@const { data: basis_data } = basis}
    <LayoutView>
        <PageToolbar
            basis={{
                header: {
                    label: `${$ls(`common.general`)}`,
                },
            }}
        />
        <LayoutPage>
            <ButtonSimple
                basis={{
                    label: `${$ls(`common.farms`)}`,
                    callback: async () => {
                        await basis.on_handle_farms();
                    },
                }}
            />
        </LayoutPage>
    </LayoutView>
    <NavigationTabs />
{/if}

<script lang="ts">
    import {
        ButtonSimple,
        get_context,
        handle_err,
        idb_init_page,
        LayoutPage,
        LayoutView,
        NavigationTabs,
        PageToolbar,
        type IViewHomeData,
    } from "$root";
    import { type CallbackPromise, type IViewBasis } from "@radroots/util";
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
            if (!basis.kv_init_prevent) await idb_init_page();
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

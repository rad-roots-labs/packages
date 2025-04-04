<script lang="ts">
    import {
        ButtonSimple,
        handle_err,
        idb_init_page,
        LayoutPage,
        LayoutView,
        NavigationTabs,
        PageToolbar,
        type IHomeViewData,
    } from "$root";
    import {
        type CallbackPromise,
        type I18nTranslateFunction,
        type IViewBasis,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        ls,
        basis,
    }: {
        basis: IViewBasis<{
            data: IHomeViewData;
            lc_handle_farms: CallbackPromise;
            lc_handle_products: CallbackPromise;
        }>;
        ls: I18nTranslateFunction;
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
                label: `${$ls(`common.general`)}`,
            },
        }}
    />
    <LayoutPage>
        <ButtonSimple
            basis={{
                label: `${$ls(`common.farms`)}`,
                callback: async () => {
                    await basis.lc_handle_farms();
                },
            }}
        />
    </LayoutPage>
</LayoutView>
<NavigationTabs />

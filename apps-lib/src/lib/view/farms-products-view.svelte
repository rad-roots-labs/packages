<script lang="ts">
    import {
        ButtonLabelDashed,
        LayoutPage,
        LayoutView,
        PageToolbar,
        lls,
    } from "$root";
    import {
        type CallbackPromise,
        type CallbackRoute,
        type IViewBasis,
        type ResolveFarmProductInfo,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: ResolveFarmProductInfo[];
            callback_route?: CallbackRoute<string>;
            lc_handle_farm_product_add: CallbackPromise;
        }>;
    } = $props();
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.products`)}`,
                callback_route: basis.callback_route || { route: `/farms` },
            },
        }}
    />
    <LayoutPage>
        {#if basis.data?.length}
            {#each basis.data as li}
                <div class={`flex flex-row justify-start items-center`}>
                    {JSON.stringify(li)}
                </div>
            {/each}
        {:else}
            <ButtonLabelDashed
                basis={{
                    label: `Add product`,
                    callback: async () => {
                        await basis.lc_handle_farm_product_add();
                    },
                }}
            />
        {/if}
    </LayoutPage>
</LayoutView>

<script lang="ts">
    import {
        ButtonLabelDashed,
        LayoutPage,
        LayoutView,
        PageToolbar,
    } from "$root";
    import {
        type CallbackPromise,
        type CallbackRoute,
        type I18nTranslateFunction,
        type IViewBasis,
        type ResolveFarmProductInfo,
    } from "@radroots/util";

    let {
        basis,
        ls,
    }: {
        basis: IViewBasis<{
            data: ResolveFarmProductInfo[];
            callback_route?: CallbackRoute<string>;
            lc_handle_farm_product_add: CallbackPromise;
        }>;
        ls: I18nTranslateFunction;
    } = $props();
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$ls(`common.products`)}`,
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

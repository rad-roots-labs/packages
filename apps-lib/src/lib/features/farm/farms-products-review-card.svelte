<script lang="ts">
    import {
        app_lo,
        get_context,
        Glyph,
        ImagePath,
        lib_parse_currency_marker,
        type IViewFarmsProductsAddSubmitPayload,
    } from "$root";
    import { parse_geocode_address, symbols } from "@radroots/util";

    const { ls, locale } = get_context(`lib`);

    let {
        basis,
    }: {
        basis: {
            data: IViewFarmsProductsAddSubmitPayload | undefined;
        };
    } = $props();

    //@todo
</script>

<div
    class={`flex flex-col h-[20rem] w-lo_line_entry_${$app_lo} justify-start items-start rounded-touch bg-layer-1-surface overflow-hidden`}
>
    <div class={`flex flex-row h-[10rem] w-full justify-center items-center`}>
        {#if basis.data?.photos.length}
            <ImagePath
                basis={{
                    path: basis.data.photos[0],
                }}
            />
        {:else}
            <div
                class={`flex flex-row h-full w-full justify-center items-center bg-layer-2-surface`}
            >
                <div class={`flex flex-col justify-start items-center`}>
                    <Glyph
                        basis={{
                            classes: `text-layer-0-glyph`,
                            dim: `sm`,
                            key: `image-broken`,
                        }}
                    />
                    <p
                        class={`font-sans font-[400] text-sm text-layer-0-glyph`}
                    >
                        {`No photo`}
                    </p>
                </div>
            </div>
        {/if}
    </div>
    <div
        class={`flex flex-col h-[10rem] w-full px-3 py-2 justify-start items-center`}
    >
        {#if basis.data}
            {@const data_geoc_address = parse_geocode_address(
                basis.data.geocode_result,
            )}
            <div class={`flex flex-row w-full justify-between items-center`}>
                <div class={`flex flex-row gap-1 justify-start items-center`}>
                    <p
                        class={`font-sans font-[600] text-xl text-th-black capitalize`}
                    >
                        {basis.data.product}
                    </p>
                </div>
                <div
                    class={`flex flex-row gap-[2px] justify-start items-center`}
                >
                    <p class={`font-sans font-[600] text-xl text-th-black`}>
                        {`${lib_parse_currency_marker($locale, basis.data.price_currency)}${basis.data.price_amount}`}
                    </p>
                    <p class={`font-sans font-[600] text-xl text-th-black`}>
                        {`/`}
                    </p>
                    <p class={`font-sans font-[600] text-xl text-th-black`}>
                        {`${$ls(`units.mass.unit.${basis.data.price_quantity_unit}_ab`)}`}
                    </p>
                </div>
            </div>
            <div class={`flex flex-row w-full justify-between items-center`}>
                <div class={`flex flex-row gap-1 justify-start items-center`}>
                    <p
                        class={`font-sans font-[600] text-lg text-layer-1-glyph capitalize`}
                    >
                        {basis.data.process}
                    </p>
                    <p
                        class={`font-sans font-[600] text-xl text-layer-1-glyph`}
                    >
                        {symbols.bullet}
                    </p>
                    <p
                        class={`font-sans font-[600] text-lg text-layer-1-glyph`}
                    >
                        {`${basis.data.quantity_amount} ${$ls(`units.mass.unit.${basis.data.quantity_unit}_ab`)} ${basis.data.quantity_label}`}
                    </p>
                </div>
            </div>
            <div class={`flex flex-row w-full justify-start items-center`}>
                <p
                    class={`font-sans font-[400] text-sm text-th-black capitalize line-clamp-2 overflow-hidden text-ellipsis`}
                >
                    {basis.data.description}
                </p>
            </div>
            {#if data_geoc_address}
                <div
                    class={`flex flex-row w-full pt-2 justify-between items-center`}
                >
                    <div
                        class={`flex flex-row gap-1 justify-start items-center`}
                    >
                        <p class={`font-sans font-[600] text-th-black`}>
                            {`${data_geoc_address.primary}, ${data_geoc_address.admin}`}
                        </p>
                        <p class={`font-sans font-[600] text-th-black`}>
                            {symbols.bullet}
                        </p>
                        <p class={`font-sans font-[600] text-th-black`}>
                            {`${data_geoc_address.country}`}
                        </p>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

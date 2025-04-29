<script lang="ts">
    import {
        ButtonSimple,
        Empty,
        get_context,
        Glyph,
        handle_err,
        LayoutPage,
        LayoutView,
        Map,
        MapMarkerArea,
        PageToolbar,
        type CallbackRoute,
        type IViewFarmsDetailsData,
    } from "$root";
    import {
        fmt_geolocation_address,
        geol_lat_fmt,
        geol_lng_fmt,
        parse_geol_point_tup,
        parse_tup_geop_point,
        type CallbackPromiseGeneric,
        type GeolocationPointTuple,
        type IViewBasis,
    } from "@radroots/util";
    import { onDestroy, onMount } from "svelte";

    const { ls, locale } = get_context(`lib`);

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: IViewFarmsDetailsData;
            callback_route?: CallbackRoute<string>;
            on_handle_farm_lot_add: CallbackPromiseGeneric<string>;
            on_handle_farm_products_view: CallbackPromiseGeneric<string>;
            on_handle_farm_orders_view: CallbackPromiseGeneric<string>;
        }>;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);
    let map_center: GeolocationPointTuple = $state([0, 0]);

    onMount(async () => {
        try {
            if (basis.on_mount) await basis.on_mount();
            if (basis.data?.location)
                map_center = parse_geol_point_tup(basis.data?.location.point);
            if (map) {
                map.setCenter(map_center);
                map.setZoom(11);
            }
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    onDestroy(async () => {
        try {
            if (basis.on_destroy) await basis.on_destroy();
        } catch (e) {
            handle_err(e, `on_destroy`);
        }
    });

    const map_geop = $derived(parse_tup_geop_point(map_center));

    const farm_addr_fmt = $derived(
        basis.data?.location?.address
            ? fmt_geolocation_address(basis.data?.location.address)
            : ``,
    );

    const farm_geop_lat = $derived(
        basis.data?.location?.point
            ? geol_lat_fmt(basis.data?.location.point.lat, `dms`, $locale, 3)
            : ``,
    );

    const farm_geop_lng = $derived(
        basis.data?.location?.point
            ? geol_lng_fmt(basis.data?.location.point.lng, `dms`, $locale, 3)
            : ``,
    );
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$ls(`common.farms`)}${basis.data?.farm.name ? ` / ${basis.data?.farm.name}` : ``}`,
                callback_route: basis.callback_route,
            },
        }}
    />
    <LayoutPage>
        <div
            class={`flex flex-row h-[12rem] w-full justify-start items-center`}
        >
            <div
                class={`flex flex-col basis-1/2 h-full p-4 gap-2 justify-start items-center`}
            >
                <div class={`flex flex-col w-full justify-start items-center`}>
                    <div
                        class={`flex flex-row w-full justify-start items-center`}
                    >
                        <p
                            class={`font-sans font-[500] text-lg text-layer-0-glyph`}
                        >
                            {farm_addr_fmt}
                        </p>
                    </div>
                    <div
                        class={`flex flex-row w-full justify-start items-center`}
                    >
                        <p
                            class={`font-sans font-[500] text-lg text-layer-0-glyph tracking-tight`}
                        >
                            {farm_geop_lat && farm_geop_lng
                                ? `${farm_geop_lat}, ${farm_geop_lng}`
                                : ``}
                        </p>
                    </div>
                </div>
            </div>
            <div
                class={`flex flex-col basis-1/2 h-full justify-start items-center`}
            >
                <div
                    class={`flex flex-col h-full w-full p-4 gap-4 justify-start items-center bg-layer-1-surface rounded-2xl`}
                >
                    <p
                        class={`font-sans font-[500] text-sm text-layer-0-glyph`}
                    >
                        {`Farm Info`}
                    </p>
                    <div
                        class={`flex flex-col w-full gap-1 justify-start items-center`}
                    >
                        <div
                            class={`flex flex-row w-full gap-4 justify-between items-center`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`Farm Size:`}
                            </p>

                            {#if basis.data?.farm.area && basis.data?.farm.area_unit}
                                <p
                                    class={`font-sans font-[400] text-layer-0-glyph`}
                                >
                                    {`${basis.data?.farm.area} ${basis.data?.farm.area_unit}`}
                                </p>
                            {:else}
                                <div
                                    class={`flex flex-row gap-line justify-start items-center`}
                                >
                                    <p
                                        class={`font-sans font-[400] text-layer-0-glyph_pl`}
                                    >
                                        {`Add`}
                                    </p>
                                    <Glyph
                                        basis={{
                                            classes: `text-layer-0-glyph_pl`,
                                            dim: `xs`,
                                            key: `caret-right`,
                                        }}
                                    />
                                </div>
                            {/if}
                        </div>
                        <div
                            class={`flex flex-row w-full gap-4 justify-between items-center`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`Farm Lots:`}
                            </p>
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`${basis.data?.lots?.length || 0}`}
                            </p>
                        </div>
                        <div
                            class={`flex flex-row w-full gap-4 justify-between items-center`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`Products:`}
                            </p>
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`${0}`}
                            </p>
                        </div>
                        <div
                            class={`flex flex-row w-full gap-4 justify-between items-center`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`Orders:`}
                            </p>
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {`${0}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class={`flex flex-col w-full gap-3 justify-center items-center`}>
            <ButtonSimple
                basis={{
                    label: `View Products`,
                    callback: async () => {
                        if (basis.data?.farm.id)
                            await basis.on_handle_farm_products_view(
                                basis.data?.farm.id,
                            );
                    },
                }}
            />
            <ButtonSimple
                basis={{
                    label: `View Orders`,
                    callback: async () => {
                        if (basis.data?.farm.id)
                            await basis.on_handle_farm_orders_view(
                                basis.data?.farm.id,
                            );
                    },
                }}
            />
        </div>
        <div
            class={`flex flex-col flex-shrink-0 h-[16rem] w-full justify-center items-center rounded-2xl overflow-hidden`}
        >
            <Map
                bind:map
                basis={{
                    interactive: false,
                }}
            >
                <MapMarkerArea
                    {map_geop}
                    basis={{
                        no_drag: true,
                    }}
                />
            </Map>
        </div>
        <div
            class={`flex flex-col h-[12rem] w-full justify-center items-center`}
        >
            <Empty />
        </div>
    </LayoutPage>
</LayoutView>

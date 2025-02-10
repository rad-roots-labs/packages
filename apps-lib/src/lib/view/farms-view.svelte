<script lang="ts">
    import Empty from "$lib/components/lib/empty.svelte";
    import {
        ButtonSimple,
        Glyph,
        handle_err,
        LayoutPage,
        LayoutView,
        liblocale,
        lls,
        Map,
        MapMarkerArea,
        PageToolbar,
    } from "$root";
    import {
        geol_lat_fmt,
        geol_lng_fmt,
        lib_address_fmt,
        parse_geom_point_tup,
        parse_tup_geop_point,
        type CallbackPromiseGeneric,
        type CallbackRoute,
        type GeolocationPointTuple,
        type IViewBasis,
        type LcGeocodeCallback,
        type ResolveFarmInfo,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
    }: {
        basis: IViewBasis<{
            data: ResolveFarmInfo;
            callback_route?: CallbackRoute<string>;
            lc_geocode: LcGeocodeCallback;
            lc_handle_farm_lot_add: CallbackPromiseGeneric<string>;
            lc_handle_farm_products_view: CallbackPromiseGeneric<string>;
            lc_handle_farm_orders_view: CallbackPromiseGeneric<string>;
        }>;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);
    let map_center: GeolocationPointTuple = $state([0, 0]);

    onMount(async () => {
        try {
            if (map && basis.data?.geolocation?.point) {
                map_center = parse_geom_point_tup(basis.data.geolocation.point);
                map.setCenter(map_center);
                map.setZoom(12);
            }
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    const map_geop = $derived(parse_tup_geop_point(map_center));

    const info_addr_fmt = $derived(
        basis.data?.geolocation?.address
            ? lib_address_fmt(basis.data.geolocation.address)
            : ``,
    );

    const info_geop_lat = $derived(
        basis.data?.geolocation?.point?.coordinates
            ? geol_lat_fmt(
                  basis.data.geolocation.point.coordinates[1],
                  `dms`,
                  $liblocale,
                  3,
              )
            : ``,
    );

    const info_geop_lng = $derived(
        basis.data?.geolocation?.point?.coordinates
            ? geol_lng_fmt(
                  basis.data.geolocation.point.coordinates[0],
                  `dms`,
                  $liblocale,
                  3,
              )
            : ``,
    );
</script>

<LayoutView>
    <PageToolbar
        basis={{
            header: {
                label: `${$lls(`common.farms`)} / ${basis.data.name || ``}`,
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
                            {info_addr_fmt}
                        </p>
                    </div>
                    <div
                        class={`flex flex-row w-full justify-start items-center`}
                    >
                        <p
                            class={`font-sans font-[500] text-lg text-layer-0-glyph tracking-tight`}
                        >
                            {info_geop_lat && info_geop_lng
                                ? `${info_geop_lat}, ${info_geop_lng}`
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

                            {#if basis.data.area && basis.data.area_unit}
                                <p
                                    class={`font-sans font-[400] text-layer-0-glyph`}
                                >
                                    {`${basis.data.area} ${basis.data.area_unit}`}
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
                                {`${basis.data.farm_lots?.length || 0}`}
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
                        await basis.lc_handle_farm_products_view(basis.data.id);
                    },
                }}
            />
            <ButtonSimple
                basis={{
                    label: `View Orders`,
                    callback: async () => {
                        await basis.lc_handle_farm_orders_view(basis.data.id);
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
                        lc_geocode: basis.lc_geocode,
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

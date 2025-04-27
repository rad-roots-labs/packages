<script lang="ts">
    import {
        Map,
        MapMarkerArea,
        type IViewFarmsDataListItem,
        type LcGeocodeCallback,
    } from "$root";
    import {
        fmt_geolocation_address,
        geol_lat_fmt,
        geol_lng_fmt,
        parse_geom_point_tup,
        parse_tup_geop_point,
        type CallbackPromiseGeneric,
        type GeolocationPointTuple,
        type I18nTranslateFunction,
        type I18nTranslateLocale,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        lc_geocode,
        lc_handle_farm_view,
        ls,
        locale,
    }: {
        basis: IViewFarmsDataListItem;
        lc_geocode: LcGeocodeCallback;
        lc_handle_farm_view: CallbackPromiseGeneric<string>;
        ls: I18nTranslateFunction;
        locale: I18nTranslateLocale;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);
    let map_center: GeolocationPointTuple = $state([0, 0]);

    onMount(async () => {
        if (map && basis.geolocation?.point) {
            map_center = parse_geom_point_tup(basis.geolocation.point);
            map.setCenter(map_center);
        } else {
            //@todo
        }
    });

    const map_geop = $derived(parse_tup_geop_point(map_center));

    const farm_addr_fmt = $derived(
        basis.geolocation?.address
            ? fmt_geolocation_address(basis.geolocation.address)
            : ``,
    );

    const farm_geop_lat = $derived(
        basis.geolocation?.point?.coordinates
            ? geol_lat_fmt(
                  basis.geolocation.point.coordinates[1],
                  `dms`,
                  $locale,
                  3,
              )
            : ``,
    );

    const farm_geop_lng = $derived(
        basis.geolocation?.point?.coordinates
            ? geol_lng_fmt(
                  basis.geolocation.point.coordinates[0],
                  `dms`,
                  $locale,
                  3,
              )
            : ``,
    );
</script>

<button
    class={`z-10 relative flex flex-col w-full p-4 gap-3 justify-start items-center bg-layer-1-surface layer-1-active-raise-less layer-1-active-ring rounded-3xl el-re`}
    onclick={async () => {
        if (basis.id) await lc_handle_farm_view(basis.id);
    }}
>
    <div class={`flex flex-col w-full gap-2 justify-center items-center`}>
        <div class={`flex flex-row w-full justify-between items-center`}>
            <p class={`font-sans font-[500] text-3xl text-layer-0-glyph`}>
                {basis.name}
            </p>

            <div
                class={`flex flex-row h-6 px-2 py-1 justify-center items-center bg-lime-400 rounded-lg`}
            >
                <p class={`font-sans font-[700] text-white`}>
                    {`${$ls(`common.farm`)}`}
                </p>
            </div>
        </div>
        <div class={`flex flex-col w-full justify-center items-center`}>
            <div class={`flex flex-row w-full justify-start items-center`}>
                <p class={`font-sans font-[500] text-lg text-layer-0-glyph`}>
                    {farm_addr_fmt}
                </p>
            </div>
            <div class={`flex flex-row w-full justify-start items-center`}>
                <p class={`font-sans font-[500] text-lg text-layer-0-glyph`}>
                    {farm_geop_lat && farm_geop_lng
                        ? `${farm_geop_lat}, ${farm_geop_lng}`
                        : ``}
                </p>
            </div>
        </div>
    </div>
    <div
        class={`flex flex-col h-[16rem] w-full justify-center items-center rounded-2xl overflow-hidden`}
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
                    lc_geocode,
                }}
            />
        </Map>
    </div>
</button>

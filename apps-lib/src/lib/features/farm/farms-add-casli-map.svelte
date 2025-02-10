<script lang="ts">
    import {
        CarouselItem,
        Map,
        MapMarkerArea,
        WrapBorder,
        handle_err,
    } from "$root";
    import {
        type GeocoderReverseResult,
        type GeolocationPoint,
        type LcGeocodeCallback,
        type LcGeocodeCurrentCallback,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        map_geoc = $bindable(undefined),
        map_geop = $bindable(undefined),
        farm_geop_lat,
        farm_geop_lng,
    }: {
        basis: {
            lc_geop_current: LcGeocodeCurrentCallback;
            lc_geocode: LcGeocodeCallback;
        };
        map_geoc: GeocoderReverseResult | undefined;
        map_geop: GeolocationPoint | undefined;
        farm_geop_lat: string;
        farm_geop_lng: string;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);

    onMount(async () => {
        try {
            const geop = await basis.lc_geop_current();
            if (!geop) return;
            map_geop = { ...geop };
            const geoc = await basis.lc_geocode(geop);
            if (!geoc) return;
            map_geoc = geoc;
            if (map) map.setCenter([map_geop.lng, map_geop.lat]);
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<CarouselItem>
    <div
        class={`flex flex-col h-[100vh] w-full px-6 gap-4 justify-start items-center`}
    >
        <WrapBorder basis={{ classes: `h-[24rem] m_1:h-[80%]` }}>
            <Map bind:map>
                {#if map_geop}
                    <MapMarkerArea
                        bind:map_geop
                        bind:map_geoc
                        basis={{
                            lc_geocode: basis.lc_geocode,
                            show_display: true,
                        }}
                    />
                {/if}
            </Map>
        </WrapBorder>
        {#if map_geop}
            <div
                class={`flex flex-col w-full gap-1 justify-center items-center`}
            >
                <div
                    class={`flex flex-row w-full gap-2 justify-center items-center`}
                >
                    <p class={`font-sans font-[500] text-layer-0-glyph`}>
                        {farm_geop_lat}
                    </p>
                    <p class={`font-sans font-[500] text-layer-0-glyph`}>
                        {farm_geop_lng}
                    </p>
                </div>
            </div>
        {/if}
    </div>
</CarouselItem>

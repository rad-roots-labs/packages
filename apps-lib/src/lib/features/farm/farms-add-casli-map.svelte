<script lang="ts">
    import Fade from "$lib/components/lib/fade.svelte";
    import {
        CarouselItem,
        Map,
        MapMarkerArea,
        WrapBorder,
        app_lo,
        focus_map_marker,
        geop_is_valid,
        handle_err,
        type LcGeocodeCallback,
        type LcGeocodeCurrentCallback,
    } from "$root";
    import {
        type GeocoderReverseResult,
        type GeolocationPoint,
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

    const is_valid_geop = $derived(geop_is_valid(map_geop));

    onMount(async () => {
        try {
            const geop = await basis.lc_geop_current();
            if (!geop) return;
            map_geop = { ...geop };
            const geoc = await basis.lc_geocode(geop);
            if (!geoc) return;
            map_geoc = geoc;
            if (map) map.setCenter([map_geop.lng, map_geop.lat]);
            focus_map_marker();
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });
</script>

<CarouselItem>
    <div
        class={`flex flex-col h-[100vh] w-full px-6 gap-4 justify-start items-center`}
    >
        <WrapBorder basis={{ classes: `h-lo_view_main_${$app_lo}` }}>
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
        {#if is_valid_geop}
            <Fade>
                <div
                    class={`flex flex-col w-full gap-1 justify-center items-center`}
                >
                    <div
                        class={`flex flex-row w-full gap-2 justify-center items-center`}
                    >
                        <p
                            class={`font-sans font-[500] text-layer-0-glyph tracking-tightest`}
                        >
                            {farm_geop_lat}
                        </p>
                        <p
                            class={`font-sans font-[500] text-layer-0-glyph tracking-tightest`}
                        >
                            {farm_geop_lng}
                        </p>
                    </div>
                </div>
            </Fade>
        {/if}
    </div>
</CarouselItem>

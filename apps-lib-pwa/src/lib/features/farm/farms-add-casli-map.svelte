<script lang="ts">
    import WrapBorder from "$lib/components/lib/wrap-border.svelte";
    import MapMarkerArea from "$lib/components/map/map-marker-area.svelte";
    import Map from "$lib/components/map/map.svelte";
    import { app_lo } from "$lib/stores/app";
    import { focus_map_marker } from "$lib/utils/map";
    import {
        CarouselItem,
        Fade,
        geop_is_valid,
        get_context,
    } from "@radroots/apps-lib";
    import {
        handle_err,
        type GeocoderReverseResult,
        type GeolocationPoint,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    const { lc_geop_current, lc_geocode } = get_context(`lib`);

    let {
        map_geoc = $bindable(undefined),
        map_geop = $bindable(undefined),
        farm_geop_lat,
        farm_geop_lng,
    }: {
        map_geoc: GeocoderReverseResult | undefined;
        map_geop: GeolocationPoint | undefined;
        farm_geop_lat: string;
        farm_geop_lng: string;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);

    const is_valid_geop = $derived(geop_is_valid(map_geop));

    onMount(async () => {
        try {
            const geop = await lc_geop_current();
            if (!geop) return;
            map_geop = { ...geop };
            const geoc = await lc_geocode(geop);
            if (!geoc) return;
            map_geoc = geoc;
            if (map && map_geop) map.setCenter([map_geop.lng, map_geop.lat]);
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
                            class={`font-sans font-[500] text-ly0-gl tracking-tightest`}
                        >
                            {farm_geop_lat}
                        </p>
                        <p
                            class={`font-sans font-[500] text-ly0-gl tracking-tightest`}
                        >
                            {farm_geop_lng}
                        </p>
                    </div>
                </div>
            </Fade>
        {/if}
    </div>
</CarouselItem>

<script lang="ts">
    import type { IMapMarkerArea } from "$lib/types/components/lib";
    import { get_context } from "@radroots/apps-lib";
    import {
        type GeocoderReverseResult,
        type GeolocationPoint,
    } from "@radroots/utils";
    import { Marker, Popup } from "svelte-maplibre";
    import MapMarkerAreaDisplay from "./map-marker-area-display.svelte";

    const { lc_geocode } = get_context(`lib`);

    let {
        basis,
        map_geop = $bindable(),
        map_geoc = $bindable(undefined),
    }: {
        basis: IMapMarkerArea;
        map_geop: GeolocationPoint;
        map_geoc?: GeocoderReverseResult | undefined;
    } = $props();
</script>

<Marker
    bind:lngLat={map_geop}
    draggable={!basis.no_drag}
    class={`flex flex-row h-[100px] w-[100px] bg-blue-400/20 border-[2px] border-white justify-center items-center rounded-full shadow-lg`}
    ondragend={async () => {
        if (!map_geop) return;
        const geoc = await lc_geocode(map_geop);
        if (geoc) map_geoc = geoc;
    }}
>
    {#if basis.show_display}
        <Popup open={basis.show_display} offset={[0, -55]}>
            <MapMarkerAreaDisplay
                basis={map_geoc
                    ? {
                          primary: map_geoc.name,
                          admin: map_geoc.admin1_name,
                          country: map_geoc.country_name,
                      }
                    : undefined}
            />
        </Popup>
    {/if}
</Marker>

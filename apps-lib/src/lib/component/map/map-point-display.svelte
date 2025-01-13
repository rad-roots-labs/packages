<script lang="ts">
    import {
        app_thc,
        cfg_map,
        fmt_cl,
        type GeolocationPoint,
        type IClOpt,
        MapMarkerDot,
    } from "$lib";
    import { MapLibre, Marker } from "@radroots/svelte-maplibre";

    export let basis: IClOpt & {
        point: GeolocationPoint;
        zoom?: number;
    };
</script>

<MapLibre
    center={basis.point}
    zoom={basis.zoom || 4}
    class={`${fmt_cl(basis.classes)} relative aspect-1 w-full`}
    style={cfg_map.styles.base[$app_thc]}
    attributionControl={false}
>
    <Marker bind:lngLat={basis.point} draggable={false}>
        <MapMarkerDot />
    </Marker>
</MapLibre>

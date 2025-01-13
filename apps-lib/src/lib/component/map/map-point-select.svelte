<script lang="ts">
    import {
        app_thc,
        cfg_map,
        Empty,
        handle_err,
        MapPopupPointGeolocation,
        type GeocoderReverseResult,
        type GeolocationPoint,
        type IClOpt,
        type ILcGeocodeCallback,
    } from "$lib";
    import { MapLibre, Marker, Popup } from "@radroots/svelte-maplibre";

    let map_center: GeolocationPoint = {
        ...cfg_map.coords.default,
    };
    export let map_point: GeolocationPoint = {
        ...cfg_map.coords.default,
    };
    export let map_point_geoc_r: GeocoderReverseResult | undefined = undefined;

    export let basis: IClOpt & {
        lc_geocode: ILcGeocodeCallback;
    };

    $: if (map_point && map_center.lat === 0 && map_center.lng === 0) {
        map_center = map_point;
        (async () => {
            try {
                map_point_geoc_r = await basis.lc_geocode(map_center);
            } catch (e) {
                await handle_err(e, `map-point-select-lc-geocode-init`);
            }
        })();
    }
</script>

<MapLibre
    center={map_center}
    zoom={10}
    class={`relative h-full w-full`}
    style={cfg_map.styles.base[$app_thc]}
    attributionControl={false}
>
    <Marker
        bind:lngLat={map_point}
        draggable
        class={`flex flex-row h-map_circle w-map_circle justify-center items-center bg-white rounded-full shadow-lg`}
        on:dragend={async () => {
            if (!map_point) return;
            const geoc_r = await basis.lc_geocode(map_point);
            if (geoc_r) map_point_geoc_r = geoc_r;
        }}
    >
        <div
            class={`flex flex-row h-map_circle_inner w-map_circle_inner justify-center items-center bg-blue-400 rounded-full`}
        >
            <Empty />
        </div>
        <Popup open={true} offset={[0, -10]}>
            <MapPopupPointGeolocation
                basis={{
                    point: map_point,
                    geoc_r: map_point_geoc_r,
                }}
            />
        </Popup>
    </Marker>
</MapLibre>

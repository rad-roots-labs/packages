<script lang="ts">
    import { ButtonSimple, EnvelopeLowerFull, Map, MapMarkerArea } from "$root";
    import {
        type CallbackPromiseGeneric,
        type GeocoderReverseResult,
        type GeolocationPoint,
        type LcGeocodeCallback,
        type ResolveFarmInfo,
        cfg_map,
        parse_geol_point_tup,
    } from "@radroots/util";

    let {
        basis,
        map_geop = $bindable(undefined),
        map_geoc = $bindable(undefined),
    }: {
        basis: {
            farm_info: ResolveFarmInfo;
            visible: boolean;
            lc_geocode: LcGeocodeCallback;
            lc_submit: CallbackPromiseGeneric<{
                map_geop: GeolocationPoint | undefined;
                map_geoc: GeocoderReverseResult | undefined;
            }>;
        };
        map_geop?: GeolocationPoint;
        map_geoc?: GeocoderReverseResult;
    } = $props();

    let map: maplibregl.Map | undefined = $state(undefined);
    let map_init = $state(false);

    $effect(() => {
        if (basis.visible && map && map_geop && !map_init) {
            map.setCenter(parse_geol_point_tup(map_geop));
            map_init = true;
        }
    });

    $effect(() => {
        if (basis.visible === false) map_init = false; //@todo
    });
</script>

<EnvelopeLowerFull
    basis={{
        visible: basis.visible,
    }}
>
    <div
        class={`relative flex flex-col h-full w-full justify-center items-center bg-layer-1-surface`}
    >
        <Map
            bind:map
            basis={{
                zoom_click_off: true,
            }}
        >
            {#if map_geop}
                <MapMarkerArea
                    bind:map_geop
                    bind:map_geoc
                    basis={{
                        show_display: !!map_geop,
                        lc_geocode: basis.lc_geocode,
                    }}
                />
            {/if}
        </Map>
        <div
            class={`absolute bottom-0 left-0 flex flex-row h-24 w-full px-4 justify-center items-start`}
        >
            <ButtonSimple
                basis={{
                    label: `Choose location`,
                    callback: async () => {
                        await basis.lc_submit({ map_geoc, map_geop });
                        if (map) map.setCenter(cfg_map.coords.default);
                    },
                }}
            />
        </div>
    </div>
</EnvelopeLowerFull>

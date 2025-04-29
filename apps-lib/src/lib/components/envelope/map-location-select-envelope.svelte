<script lang="ts">
    import {
        ButtonLayoutPair,
        EnvelopeLowerFull,
        Map,
        MapMarkerArea,
    } from "$root";
    import {
        cfg_map,
        parse_geol_point_tup,
        type CallbackPromiseGeneric,
        type GeocoderReverseResult,
        type GeolocationPoint,
    } from "@radroots/util";
    import LayoutBottomButton from "../layout/layout-bottom-button.svelte";

    let {
        basis,
        map_geop = $bindable(undefined),
        map_geoc = $bindable(undefined),
    }: {
        basis: {
            visible: boolean;
            on_submit: CallbackPromiseGeneric<
                | {
                      map_geop: GeolocationPoint | undefined;
                      map_geoc: GeocoderReverseResult | undefined;
                  }
                | undefined
            >;
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
                    }}
                />
            {/if}
        </Map>
        <LayoutBottomButton>
            <ButtonLayoutPair
                basis={{
                    continue: {
                        label: `Choose location`,
                        disabled: false,
                        callback: async () => {
                            await basis.on_submit({ map_geoc, map_geop });
                            if (map) map.setCenter(cfg_map.coords.default);
                        },
                    },
                    back: {
                        label: `Back`,
                        visible: true,
                        callback: async () => {
                            await basis.on_submit(undefined);
                        },
                    },
                }}
            />
        </LayoutBottomButton>
    </div>
</EnvelopeLowerFull>

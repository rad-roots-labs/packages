<script lang="ts">
    import { app_thc } from "$lib/store/app";
    import { MapLibre } from "svelte-maplibre";
    import { cfg_map, fmt_cl, type IClOpt } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis = undefined,
        map = $bindable(undefined),
        children,
    }: {
        basis?: IClOpt & {
            interactive?: boolean;
            zoom_click_off?: boolean;
        };
        map?: maplibregl.Map;
        interactive?: boolean;
        children: Snippet;
    } = $props();

    const interactive = $derived(
        typeof basis?.interactive === `boolean` ? basis?.interactive : true,
    );

    const zoomOnDoubleClick = $derived(
        typeof basis?.zoom_click_off === `boolean`
            ? basis?.zoom_click_off
            : true,
    );
</script>

<MapLibre
    bind:map
    class="{fmt_cl(basis?.classes)} relative h-full w-full"
    zoom={10}
    style={cfg_map.styles.base[$app_thc]}
    attributionControl={false}
    {interactive}
    {zoomOnDoubleClick}
>
    {@render children()}
</MapLibre>

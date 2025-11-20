<script lang="ts">
    import { cfg_map } from "$lib/utils/map";
    import { type IClOpt, fmt_cl, theme_mode } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";
    import { MapLibre } from "svelte-maplibre";

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
    style={cfg_map.styles.base[$theme_mode || "light"]}
    attributionControl={false}
    {interactive}
    {zoomOnDoubleClick}
>
    {@render children()}
</MapLibre>

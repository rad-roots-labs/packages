<script lang="ts">
    import { CFG_MAP } from "$lib/utils/map";
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

    const double_click_zoom = $derived(
        typeof basis?.zoom_click_off === `boolean`
            ? basis?.zoom_click_off
            : true,
    );
</script>

<MapLibre
    bind:map
    class="{fmt_cl(basis?.classes)} relative h-full w-full"
    zoom={10}
    style={CFG_MAP.styles.base[$theme_mode ?? "light"]}
    attributionControl={false}
    interactive={!!interactive}
    zoomOnDoubleClick={double_click_zoom}
>
    {@render children()}
</MapLibre>

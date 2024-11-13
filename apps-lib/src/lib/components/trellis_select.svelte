<script lang="ts">
    import {
        TrellisEnd,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisSelect,
    } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";
    import TrellisLine from "./trellis_line.svelte";

    export let basis: ITrellisBasisSelect;
    export let layer: ThemeLayer;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
    export let hide_active: boolean;
</script>

<TrellisLine {layer} {hide_border_b} {hide_border_t}>
    <TrellisRowLabel basis={basis.label} {layer} {hide_active} />
    {#if basis.display}
        <TrellisRowDisplayValue
            basis={{ ...basis.display }}
            {layer}
            {hide_active}
        />
    {/if}
    <div slot="end">
        {#if basis.end}
            <TrellisEnd basis={basis.end} {layer} {hide_active} />
        {/if}
    </div>
</TrellisLine>

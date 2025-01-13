<script lang="ts">
    import {
        TrellisEnd,
        TrellisLine,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisTouch,
    } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: ITrellisBasisTouch;
    export let layer: ThemeLayer;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
    export let hide_active: boolean;
</script>

<TrellisLine {layer} {hide_border_b} {hide_border_t} callback={basis.callback}>
    <TrellisRowLabel basis={basis.label} {layer} {hide_active} />
    {#if basis.display}
        <TrellisRowDisplayValue
            basis={{
                ...basis.display,
            }}
            {layer}
            {hide_active}
        />
    {/if}
    <svelte:fragment slot="end">
        {#if basis.end}
            <TrellisEnd basis={basis.end} {layer} {hide_active} />
        {/if}
    </svelte:fragment>
</TrellisLine>

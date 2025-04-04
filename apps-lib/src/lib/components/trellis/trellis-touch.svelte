<script lang="ts">
    import {
        TrellisEnd,
        TrellisLine,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisTouch,
    } from "$root";
    import type { ThemeLayer } from "@radroots/util";

    let {
        basis,
        layer,
        hide_active,
        hide_border_b,
        hide_border_t,
    }: {
        basis: ITrellisBasisTouch;
        layer: ThemeLayer;
        hide_active: boolean;
        hide_border_b: boolean;
        hide_border_t: boolean;
    } = $props();
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
    {#snippet el_end()}
        {#if basis.end}
            <TrellisEnd basis={basis.end} {layer} {hide_active} />
        {/if}
    {/snippet}
</TrellisLine>

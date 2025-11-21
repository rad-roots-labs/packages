<script lang="ts">
    import type { ITrellisBasisTouch } from "$lib/types/components/trellis";
    import type { ThemeLayer } from "@radroots/themes";
    import TrellisEnd from "./trellis-end.svelte";
    import TrellisLine from "./trellis-line.svelte";
    import TrellisRowDisplayValue from "./trellis-row-display-value.svelte";
    import TrellisRowLabel from "./trellis-row-label.svelte";

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

<script lang="ts">
    import {
        LoadSymbol,
        SelectMenu,
        TrellisEnd,
        TrellisLine,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisSelect,
    } from "$root";
    import type { ThemeLayer } from "@radroots/theme";

    let {
        basis,
        layer,
        hide_active,
        hide_border_b,
        hide_border_t,
    }: {
        basis: ITrellisBasisSelect;
        layer: ThemeLayer;
        hide_active: boolean;
        hide_border_b: boolean;
        hide_border_t: boolean;
    } = $props();

    const loading = $derived(
        typeof basis?.loading === `boolean` ? basis.loading : false,
    );

    const value = $derived(basis.el.value);
</script>

<TrellisLine
    {layer}
    {loading}
    {hide_border_b}
    {hide_border_t}
    callback={basis.callback}
>
    <TrellisRowLabel basis={basis.label} {layer} {hide_active} />
    {#if basis.display}
        <div class={`flex flex-row pr-3 justify-center items-end`}>
            <SelectMenu {value} basis={basis.el}>
                {#if basis.display.loading}
                    <div
                        class={`flex flex-row h-full w-full justify-end items-center`}
                    >
                        <LoadSymbol basis={{ dim: `sm` }} />
                    </div>
                {:else}
                    <TrellisRowDisplayValue
                        basis={{ ...basis.display }}
                        {layer}
                        {hide_active}
                    />
                {/if}
            </SelectMenu>
        </div>
    {/if}

    {#snippet el_end()}
        {#if basis.end}
            <TrellisEnd basis={basis.end} {layer} {hide_active} />
        {/if}
    {/snippet}
</TrellisLine>

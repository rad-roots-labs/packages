<script lang="ts">
    import {
        LoadSymbol,
        SelectMenu,
        TrellisEnd,
        TrellisLine,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisSelect,
    } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: ITrellisBasisSelect;
    export let layer: ThemeLayer;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
    export let hide_active: boolean;

    $: value = basis.el.value;
    $: loading = typeof basis?.loading === `boolean` ? basis.loading : false;
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
                <svelte:fragment slot="element">
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
                </svelte:fragment>
            </SelectMenu>
        </div>
    {/if}
    <div slot="end">
        {#if basis.end && !basis.display.loading}
            <TrellisEnd basis={basis.end} {layer} {hide_active} />
        {/if}
    </div>
</TrellisLine>

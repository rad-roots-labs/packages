<script lang="ts">
    import { Glyph, type IEntrySelect, Loading, parse_layer } from "$lib";
    import SelectElement from "$lib/el/select_element.svelte";
    import EntryWrap from "./entry_wrap.svelte";

    export let value: string;
    export let basis: IEntrySelect;
    $: basis = basis;

    $: layer =
        typeof basis?.wrap.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.wrap.layer, 1);
</script>

<EntryWrap basis={basis?.wrap}>
    {#if basis?.loading}
        <div class={`flex flex-row w-full justify-center items-center`}>
            <Loading basis={{ dim: `sm`, blades: 8 }} />
        </div>
    {:else}
        <SelectElement bind:value basis={basis.el} />
    {/if}
    {#if !basis?.hide_arrows}
        <div
            class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-4 justify-end items-center`}
        >
            <Glyph
                basis={{
                    key: `caret-up-down`,
                    dim: `xs`,
                    weight: `bold`,
                    classes: `text-layer-${layer}-glyph`,
                }}
            />
        </div>
    {/if}
</EntryWrap>

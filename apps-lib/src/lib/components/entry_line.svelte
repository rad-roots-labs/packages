<script lang="ts">
    import { fmt_cl, Glyph, parse_layer, type IEntryLine } from "$lib";
    import InputElement from "$lib/ui/input_element.svelte";

    export let basis: IEntryLine;
    $: basis = basis;

    $: layer =
        typeof basis.el?.layer === `boolean`
            ? false
            : parse_layer(basis.el?.layer, 1);
    $: classes_layer =
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface`;
</script>

<div
    id={basis.id_wrap || null}
    class={`${fmt_cl(basis.classes_wrap)} relative el-responsive entry-line-wrap px-2 ${classes_layer}`}
>
    <InputElement basis={basis.el} />
    {#if basis.notify_inline}
        {#if `glyph` in basis.notify_inline}
            <div
                class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center translate-x-[34px] fade-in transition-all`}
            >
                <Glyph
                    basis={typeof basis.notify_inline.glyph === `string`
                        ? {
                              key: basis.notify_inline.glyph,
                              dim: `xs+`,
                              weight: `bold`,
                              classes: `text-layer-${layer}-glyph`,
                          }
                        : basis.notify_inline.glyph}
                />
            </div>
        {/if}
    {/if}
</div>

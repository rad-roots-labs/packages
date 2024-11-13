<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        parse_layer,
        TextareaElement,
        type IEntryMultiLine,
    } from "$lib";

    export let basis: IEntryMultiLine;
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
    id={basis.wrap?.id || null}
    class={`${fmt_cl(basis.wrap?.classes)} relative el-re entry-textarea-wrap ${classes_layer}`}
>
    <TextareaElement basis={basis.el} />
    {#if basis.notify_inline}
        {#if `glyph` in basis.notify_inline}
            <div
                class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center translate-x-[34px] fade-in `}
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

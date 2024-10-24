<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        InputElement,
        Loading,
        parse_layer,
        type IEntryLine,
        type ILoadingDimension,
    } from "$lib";

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
    $: clases_style =
        basis.style === `guide` ? `h-entry_guide rounded-touch` : ``;

    let loading_dim: ILoadingDimension = `sm`;
    $: loading_dim = basis.style === `guide` ? `md` : `sm`;
</script>

<div
    id={basis.id_wrap || null}
    class={`${fmt_cl(basis.classes)} relative el-re entry-line-wrap px-2 ${classes_layer} ${clases_style}`}
>
    <InputElement basis={basis.el} />
    {#if basis.loading}
        <div
            class={`z-5 absolute el-re right-0 top-0 flex flex-row h-full pr-4 justify-end items-center fade-in`}
        >
            <Loading
                basis={{
                    dim: loading_dim,
                }}
            />
        </div>
    {:else if basis.notify_inline}
        {#if `glyph` in basis.notify_inline}
            <div
                class={`z-5 absolute el-re right-0 top-0 flex flex-row h-full pr-3 justify-end items-center translate-x-[34px] fade-in`}
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

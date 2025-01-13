<script lang="ts">
    import {
        EntryWrap,
        Glyph,
        Input,
        LoadSymbol,
        parse_layer,
        type IEntryLine,
        type LoadingDimension,
    } from "$lib";

    export let basis: IEntryLine;

    $: layer =
        typeof basis.wrap?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis.wrap?.layer);
    $: classes_layer =
        typeof basis.wrap?.layer === `boolean`
            ? ``
            : `text-layer-${layer}-glyph`;
    let loading_dim: LoadingDimension = `sm`;
    $: loading_dim = basis.wrap?.style === `guide` ? `md` : `sm`;
</script>

<EntryWrap basis={basis?.wrap}>
    <Input basis={basis.el}></Input>
    {#if basis.loading}
        <div
            class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-4 justify-end items-center fade-in el-re`}
        >
            <LoadSymbol
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
                              classes: `${classes_layer}`,
                          }
                        : basis.notify_inline.glyph}
                ></Glyph>
            </div>
        {/if}
    {/if}
</EntryWrap>

<script lang="ts">
    import {
        Glyph,
        parse_layer,
        type IEntryLine,
        type LoadingDimension,
    } from "@radroots/apps-lib";
    import InputValue from "../lib/input-value.svelte";
    import LoadSymbol from "../lib/load-symbol.svelte";
    import EntryWrap from "./entry-wrap.svelte";

    let {
        basis,
        value = $bindable(``),
    }: {
        basis: IEntryLine;
        value: string;
    } = $props();

    const layer = $derived(
        parse_layer(
            typeof basis.wrap?.layer === `boolean` ? 0 : basis.wrap?.layer,
        ),
    );

    const classes_layer = $derived(
        typeof basis.wrap?.layer === `boolean` ? `` : `text-ly${layer}-gl`,
    );

    const loading_dim: LoadingDimension = $derived(
        basis.wrap?.style === `guide` ? `md` : `sm`,
    );
</script>

<EntryWrap basis={basis?.wrap}>
    <InputValue
        bind:value
        basis={{
            ...basis.el,
            classes: `h-entry_line ${basis.el.classes}`,
        }}
    />
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
                              classes: `${classes_layer}`,
                          }
                        : basis.notify_inline.glyph}
                />
            </div>
        {/if}
    {/if}
</EntryWrap>

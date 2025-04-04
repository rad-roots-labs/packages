<script lang="ts">
    import { Glyph, TextArea, type IEntryMultiLine } from "$root";
    import { fmt_cl, parse_layer } from "@radroots/util";

    let {
        basis,
        value = $bindable(``),
    }: {
        basis: IEntryMultiLine;
        value: string;
    } = $props();

    const layer = $derived(
        parse_layer(
            typeof basis.wrap?.layer === `boolean` ? 0 : basis.wrap?.layer,
        ),
    );

    const classes_layer = $derived(
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface`,
    );
</script>

<div
    id={basis.wrap?.id || null}
    class={`${fmt_cl(basis.wrap?.classes)} relative el-re entry-textarea-wrap ${classes_layer}`}
>
    <TextArea bind:value basis={basis.el} />
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

                              classes: `text-layer-${layer}-glyph`,
                          }
                        : basis.notify_inline.glyph}
                />
            </div>
        {/if}
    {/if}
</div>

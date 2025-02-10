<script lang="ts">
    import { EntryWrap, Glyph, LoadSymbol, Select } from "$root";
    import { fmt_cl, parse_layer, type IEntrySelect } from "@radroots/util";

    let {
        basis,
        value = $bindable(``),
    }: {
        basis: IEntrySelect;
        value: string;
    } = $props();

    const layer = $derived(
        typeof basis?.wrap.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.wrap.layer, 1),
    );
</script>

<EntryWrap basis={basis?.wrap}>
    {#if basis?.loading}
        <div class={`flex flex-row w-full justify-center items-center`}>
            <LoadSymbol basis={{ dim: `sm`, blades: 8 }} />
        </div>
    {:else}
        <Select
            bind:value
            basis={{
                ...basis.el,
                classes: `${fmt_cl(basis.el.classes)} w-full`,
            }}
        />
    {/if}
    {#if !basis?.hide_arrows}
        <div
            class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-4 justify-end items-center`}
        >
            <Glyph
                basis={{
                    key: `caret-up-down`,
                    dim: `xs`,

                    classes: `text-layer-${layer}-glyph_d`,
                }}
            />
        </div>
    {/if}
</EntryWrap>

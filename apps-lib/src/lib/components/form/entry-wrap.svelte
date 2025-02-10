<script lang="ts">
    import {
        fmt_cl,
        parse_layer,
        type IBasisOpt,
        type IEntryWrap,
    } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis = undefined,
        children,
    }: {
        basis?: IBasisOpt<IEntryWrap>;
        children: Snippet;
    } = $props();

    const layer = $derived(
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.layer),
    );

    const classes_layer = $derived(
        typeof basis?.layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface ${basis?.style_a ? `active:bg-layer-${layer}-surface_a` : ``}`,
    );
</script>

<button
    id={basis?.id || null}
    class={`${fmt_cl(basis?.classes)} relative entry-line-wrap ${!basis?.no_pad ? ` pl-6 pr-4` : ``} h-entry_${basis?.style ? basis.style : `line`} rounded-touch ${classes_layer} el-re`}
>
    {@render children()}
</button>

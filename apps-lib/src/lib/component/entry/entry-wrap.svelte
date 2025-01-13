<script lang="ts">
    import { fmt_cl, parse_layer, type IEntryWrap } from "$lib";

    export let basis: IEntryWrap | undefined = undefined;

    $: layer =
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.layer);
    $: classes_layer =
        typeof basis?.layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface ${basis?.style_a ? `active:bg-layer-${layer}-surface_a` : ``}`; //text-layer-${layer}-glyph_d
</script>

<button
    id={basis?.id || null}
    class={`${fmt_cl(basis?.classes)} relative entry-line-wrap ${!basis.no_pad ? ` pl-6 pr-4` : ``} h-entry_${basis?.style ? basis.style : `line`} rounded-touch ${classes_layer} el-re`}
>
    <slot />
</button>

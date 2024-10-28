<script lang="ts">
    import { fmt_cl, parse_layer, type IEntryWrap } from "$lib";

    export let basis: IEntryWrap | undefined = undefined;

    $: layer =
        typeof basis?.layer === `boolean`
            ? false
            : parse_layer(basis?.layer, 1);
    $: classes_layer =
        layer === false
            ? `bg-transparent`
            : `bg-layer-${layer}-surface text-layer-${layer}-glyph_d ${basis?.style_a ? `active:bg-layer-${layer}-surface_a` : ``}`;
</script>

<button
    id={basis?.id || null}
    class={`${fmt_cl(basis?.classes)} relative entry-line-wrap ${!basis.no_pad ? ` pl-6 pr-4` : ``} h-entry_${basis?.style ? basis.style : `line`} rounded-touch ${classes_layer} el-re`}
>
    <slot />
</button>

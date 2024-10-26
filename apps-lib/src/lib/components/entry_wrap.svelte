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
            : `bg-layer-${layer}-surface ${basis?.style_a ? `active:bg-layer-${layer}-surface_a` : ``}`;
    $: classes_h = basis?.style ? basis?.style : `form_line`;
</script>

<button
    id={basis?.id || null}
    class={`${fmt_cl(basis?.classes)} relative entry-line-wrap pl-6 pr-4 h-${classes_h} rounded-entry ${classes_layer} el-re`}
>
    <slot />
</button>

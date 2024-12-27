<script lang="ts">
    import { fmt_cl, parse_layer, type ILabelDisplay } from "$lib";

    export let basis: ILabelDisplay;
    $: basis = basis;

    $: layer =
        typeof basis?.layer === `boolean`
            ? false
            : parse_layer(basis?.layer, 1);
    $: classes_layer =
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface`;
    $: clases_style =
        basis.style === `guide` ? `h-entry_guide rounded-touch` : ``;
</script>

<div
    id={basis.id_wrap || null}
    class={`${fmt_cl(basis.classes)} relative el-re entry-line-wrap px-2 ${classes_layer} ${clases_style}`}
>
    <p
        class={`${fmt_cl(basis.label.classes)} font-sans font-[400] text-layer-0-glyph`}
    >
        {basis.label.value}
    </p>
</div>

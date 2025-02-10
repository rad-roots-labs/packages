<script lang="ts">
    import { fmt_cl, parse_layer, type ILabelDisplay } from "@radroots/util";

    let { basis }: { basis: ILabelDisplay } = $props();

    const layer = $derived(
        typeof basis?.layer === `boolean` ? 0 : parse_layer(basis?.layer, 1),
    );

    const classes_layer = $derived(
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface`,
    );

    const clases_style = $derived(
        basis.style === `guide` ? `h-entry_guide rounded-touch` : ``,
    );
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

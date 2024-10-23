<script lang="ts">
    import { fmt_cl, glyph_style_map, type IGlyph } from "$lib";

    export let basis: IGlyph;
    $: basis = basis;

    $: weight =
        !basis?.weight || basis?.weight === `regular` ? `` : `-${basis.weight}`;
    $: styles = basis?.dim
        ? glyph_style_map.get(basis.dim)
        : glyph_style_map.get(`sm`);
</script>

<div
    id={basis.id || null}
    class={`${fmt_cl(basis.classes)} flex flex-row text-[${styles?.gl_1}px] justify-center items-center`}
>
    <i class={`ph${weight} ph-${basis.key}`}></i>
</div>

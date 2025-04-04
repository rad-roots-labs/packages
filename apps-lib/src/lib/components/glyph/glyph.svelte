<script lang="ts">
    import { glyph_style_map, type IGlyph } from "$root";
    import { fmt_cl } from "@radroots/util";

    let { basis }: { basis: IGlyph } = $props();

    const styles = $derived(
        basis?.dim ? glyph_style_map.get(basis.dim) : glyph_style_map.get(`sm`),
    );

    const weight = $derived(basis.weight ? `-${basis.weight}` : `-bold`);
</script>

<div
    id={basis.id || null}
    class={`${fmt_cl(basis.classes)} flex flex-row text-[${styles?.gl_1}px] justify-center items-center`}
>
    <i class={`ph${weight} ph-${basis.key}`}></i>
</div>

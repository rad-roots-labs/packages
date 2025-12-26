<script lang="ts">
    import { GLYPH_STYLE_MAP } from "$lib/styles/glyphs";
    import type { IGlyph } from "$lib/types/components";
    import { fmt_cl } from "$lib/utils/app";

    let { basis }: { basis: IGlyph } = $props();

    const styles = $derived(
        basis?.dim ? GLYPH_STYLE_MAP.get(basis.dim) : GLYPH_STYLE_MAP.get(`sm`),
    );

    const weight = $derived(basis.weight ? `-${basis.weight}` : `-bold`);
</script>

<div
    id={basis.id || null}
    class={`${fmt_cl(basis.classes)} flex flex-row text-[${styles?.gl_1}px] justify-center items-center`}
>
    <i class={`ph${weight} ph-${basis.key}`}></i>
</div>

<script lang="ts">
    import { type IGlyph, fmt_cl, glyph_style_map } from "@radroots/apps-lib";

    let { basis }: { basis: IGlyph } = $props();
    const styles = $derived(
        basis?.dim ? glyph_style_map.get(basis.dim) : glyph_style_map.get(`sm`),
    );
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    class={`${fmt_cl(basis.classes)} flex flex-col justify-center items-center text-[${styles?.gl_1}px] el-re`}
    onclick={async () => {
        if (basis.callback) await basis.callback();
    }}
>
    <i class={`ph-bold ph-${basis.key}`}></i>
</button>

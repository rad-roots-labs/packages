<script lang="ts">
    import { glyph_style_map, type IGlyph } from "$root";
    import { fmt_cl } from "@radroots/util";

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

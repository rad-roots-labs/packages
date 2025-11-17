<script lang="ts">
    import type { IGlyphCircle } from "$lib/types/components";
    import { fmt_cl, glyph_style_map } from "@radroots/apps-lib";
    import GlyphButton from "../buttons/glyph-button.svelte";

    let { basis }: { basis: IGlyphCircle } = $props();

    const styles = $derived(
        basis?.glyph?.dim
            ? glyph_style_map.get(basis?.glyph?.dim)
            : glyph_style_map.get(`sm`),
    );
</script>

{#if styles?.dim_1}
    <div
        class={`${fmt_cl(basis?.classes_wrap)} flex flex-col h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] justify-center items-center rounded-full el-re`}
    >
        <GlyphButton basis={basis?.glyph} />
    </div>
{/if}

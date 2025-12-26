<script lang="ts">
    import type { IButtonGlyphCircle } from "$lib/types/components/lib";
    import { fmt_cl, GLYPH_STYLE_MAP } from "@radroots/apps-lib";
    import GlyphButton from "./button-glyph.svelte";

    let { basis }: { basis: IButtonGlyphCircle } = $props();

    const styles = $derived(
        basis?.glyph?.dim
            ? GLYPH_STYLE_MAP.get(basis?.glyph?.dim)
            : GLYPH_STYLE_MAP.get(`sm`),
    );
</script>

{#if styles?.dim_1}
    <div
        class={`${fmt_cl(basis?.classes_wrap)} flex flex-col h-[${
            styles?.dim_1
        }px] w-[${
            styles?.dim_1
        }px] justify-center items-center rounded-full el-re`}
    >
        <GlyphButton basis={basis?.glyph} />
    </div>
{/if}

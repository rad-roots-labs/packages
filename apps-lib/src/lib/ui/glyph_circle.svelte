<script lang="ts">
    import { type IGlyphCircle, fmt_cl, Glyph, glyph_style_map } from "$lib";

    export let basis: IGlyphCircle;

    $: styles = basis?.glyph?.dim
        ? glyph_style_map.get(basis?.glyph?.dim)
        : glyph_style_map.get(`sm`);
</script>

{#if styles?.dim_1}
    <div
        class={`${fmt_cl(basis?.classes_wrap)} flex flex-col h-[${styles?.dim_1}px] w-[${styles?.dim_1}px] justify-center items-center rounded-full transition-all`}
    >
        <Glyph basis={basis?.glyph} />
    </div>
{/if}

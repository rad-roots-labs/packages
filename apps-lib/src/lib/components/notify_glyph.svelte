<script lang="ts">
    import { Glyph, type GlyphKey, type IGlyph } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: {
        glyph: GlyphKey | IGlyph;
        layer: ThemeLayer;
    };
</script>

<div
    class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center translate-x-[34px] fade-in transition-all`}
>
    <Glyph
        basis={typeof basis.glyph === `string`
            ? {
                  key: basis.glyph,
                  dim: `xs+`,
                  weight: `bold`,
                  classes: `text-layer-${basis.layer}-glyph`,
              }
            : basis.glyph}
    />
</div>

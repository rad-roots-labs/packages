<script lang="ts">
    import { fmt_cl, Glyph, type GlyphKey, type IGlyph } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: {
        classes?: string;
        glyph: GlyphKey | IGlyph;
        layer: ThemeLayer;
    };
</script>

<div
    class={`${fmt_cl(basis.classes)} z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center fade-in transition-all`}
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

<script lang="ts">
    import type { IGlyphI } from "$lib/types/components";
    import { fmt_cl } from "$lib/utils/app";

    const GLYPH_SIZE_CLASSES = {
        xs: `text-[16px]`,
        sm: `text-[20px]`,
        md: `text-[26px]`,
        lg: `text-[32px]`,
        xl: `text-[48px]`,
        "2xl": "text-[64px]",
    };

    let { basis }: { basis: IGlyphI } = $props();
</script>

<i
    class={`ph${!basis?.weight || basis?.weight === `regular` ? `` : `-${basis?.weight}`} ph-${basis.key} ${fmt_cl(basis.classes)} ${basis.size ? GLYPH_SIZE_CLASSES[basis.size] : ""}`}
>
</i>

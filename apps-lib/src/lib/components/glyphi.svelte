<script lang="ts">
    import type { IGlyphI } from "$lib/types/components";
    import { fmt_cl } from "$lib/utils/lib";

    const styles = {
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
    class={`ph${!basis?.weight || basis?.weight === `regular` ? `` : `-${basis?.weight}`} ph-${basis.key} ${fmt_cl(basis.classes)} ${basis.size ? styles[basis.size] : ""}`}
>
</i>

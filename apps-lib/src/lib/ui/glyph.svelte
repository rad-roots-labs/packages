<script lang="ts">
    import { fmt_cl } from "$lib/utils/client";
    import { glyph_style_map } from "$lib/utils/styles";
    import type { IGlyph } from "../types/ui";

    export let basis: IGlyph;
    $: basis = basis;

    $: weight =
        !basis?.weight || basis?.weight === `regular` ? `` : `-${basis.weight}`;

    $: styles = basis?.dim
        ? glyph_style_map.get(basis.dim)
        : glyph_style_map.get(`sm`);
</script>

<button
    class={`${fmt_cl(basis.classes)} flex flex-col justify-center items-center text-[${styles?.gl_1}px] transition-all`}
    on:click={async () => {
        if (basis.callback) await basis.callback();
    }}
>
    <i class={`ph${weight} ph-${basis.key}`}></i>
</button>

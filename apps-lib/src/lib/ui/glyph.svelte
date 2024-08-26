<script lang="ts">
    import type { GeometryGlyphDimension } from "../types/client";
    import type { IGlyph } from "../types/ui";
    import { fmt_cl } from "../utils/client";

    const glyph_map: Map<GeometryGlyphDimension, string> = new Map([
        [`xs-`, `text-[13px]`],
        [`xs`, `text-[15px]`],
        [`xs+`, `text-[18px]`],
        [`sm`, `text-[20px]`],
        [`sm+`, `text-[21px]`],
        [`md-`, `text-[23px]`],
        [`md`, `text-[24px]`],
        [`md+`, `text-[27px]`],
        [`lg`, `text-[28px]`],
        [`xl`, `text-[30px]`],
    ]);

    let { basis }: { basis: IGlyph } = $props();

    let weight = $derived(
        !basis?.weight || basis?.weight === `regular` ? `` : `-${basis.weight}`,
    );

    let dimension = $derived(
        basis?.dim ? glyph_map.get(basis.dim) : glyph_map.get(`sm`),
    );
</script>

<button
    class={`${fmt_cl(basis.classes)} flex flex-row justify-center items-center transition-all ${dimension}`}
    onclick={async () => {
        if (basis.callback) await basis.callback();
    }}
>
    <i class="ph{weight} ph-{basis.key}"></i>
</button>

<script lang="ts">
    import type { GeometryGlyphDimension } from "../types/client";
    import type { IGlyph } from "../types/ui";
    import { fmt_cl } from "../utils/client";
    import Fill from "./fill.svelte";

    type StyleMap = { gl_1: number; dim_2?: number };
    const style_map: Map<GeometryGlyphDimension, StyleMap> = new Map([
        ["xs--", { gl_1: 12 }],
        ["xs-", { gl_1: 13 }],
        ["xs", { gl_1: 15 }],
        ["xs+", { gl_1: 18 }],
        ["sm", { gl_1: 20 }],
        ["sm+", { gl_1: 21 }],
        ["md-", { gl_1: 23 }],
        ["md", { gl_1: 24 }],
        ["md+", { gl_1: 27 }],
        ["lg", { gl_1: 28 }],
        ["xl", { gl_1: 30 }],
        ["xl+", { gl_1: 40 }],
    ]);

    export let basis: IGlyph;
    $: basis = basis;

    $: weight =
        !basis?.weight || basis?.weight === `regular` ? `` : `-${basis.weight}`;

    $: styles = basis?.dim ? style_map.get(basis.dim) : style_map.get(`sm`);
</script>

<button
    class={`relative flex flex-col justify-center items-center transition-all`}
    on:click={async () => {
        if (basis.callback) await basis.callback();
    }}
>
    <div
        class={`${fmt_cl(basis.classes)} z-10 flex flex-row justify-start items-center text-[${styles.gl_1}px]`}
    >
        <i class="ph{weight} ph-{basis.key}"></i>
    </div>
    {#if basis.fill_under && styles.dim_2}
        <div
            class={`z-5 absolute top-0 left-0 flex flex-row w-full justify-center items-center`}
        >
            <div
                class={`flex flex-row h-[${styles.dim_2}px] w-[${styles.dim_2}px] justify-start items-center translate-y-[10px] bg-white/80 rounded-full`}
            >
                <Fill />
            </div>
        </div>
    {/if}
</button>

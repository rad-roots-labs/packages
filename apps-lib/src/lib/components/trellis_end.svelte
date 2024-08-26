<script lang="ts">
    import type { ThemeLayer } from "@radroots/theme";
    import { glyph, type ITrellisBasisTouchEnd } from "..";

    export let basis: ITrellisBasisTouchEnd;
    export let layer: ThemeLayer;
    export let hide_active: boolean;
</script>

<div
    class={`absolute top-0 right-0 h-full w-max flex flex-row justify-center items-center`}
>
    <button
        class={`flex pr-3`}
        on:click|preventDefault={async (ev) => {
            if (basis.callback) await basis.callback(ev);
        }}
    >
        {#if basis.icon}
            <svelte:component
                this={glyph}
                basis={{
                    classes: `text-layer-${layer}-glyph-shade ${hide_active ? `` : `group-active:text-layer-${layer}-glyph_a`} translate-y-[1px] opacity-70`,
                    dim: `xs-`,
                    weight: `bold`,
                    ...basis.icon,
                }}
            />
        {/if}
    </button>
</div>

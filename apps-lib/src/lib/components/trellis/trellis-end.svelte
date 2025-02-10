<script lang="ts">
    import { Glyph } from "$root";
    import type { ThemeLayer } from "@radroots/theme";
    import { type ITrellisBasisTouchEnd } from "@radroots/util";

    let {
        basis,
        layer,
        hide_active,
    }: {
        basis: ITrellisBasisTouchEnd;
        layer: ThemeLayer;
        hide_active: boolean;
    } = $props();
</script>

<div
    class={`absolute top-0 right-0 h-full w-max flex flex-row justify-center items-center`}
>
    <button
        class={`flex pr-3`}
        onclick={async (ev) => {
            if (basis.callback) await basis.callback(ev);
        }}
    >
        {#if basis.glyph}
            <Glyph
                basis={{
                    classes: `text-layer-${layer}-glyph-shade ${hide_active ? `` : `group-active:text-layer-${layer}-glyph_a`} translate-y-[1px] opacity-70`,
                    dim: `xs+`,
                    ...basis.glyph,
                }}
            />
        {/if}
    </button>
</div>

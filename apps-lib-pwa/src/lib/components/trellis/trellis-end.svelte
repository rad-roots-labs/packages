<script lang="ts">
    import type { ITrellisBasisTouchEnd } from "$lib/types/components/trellis";
    import { Glyph } from "@radroots/apps-lib";
    import type { ThemeLayer } from "@radroots/themes";

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
                    classes: `text-ly${layer}-gl-shade ${
                        hide_active ? `` : `group-active:text-ly${layer}-gl_a`
                    } translate-y-[1px] opacity-70`,
                    dim: `xs+`,
                    ...basis.glyph,
                }}
            />
        {/if}
    </button>
</div>

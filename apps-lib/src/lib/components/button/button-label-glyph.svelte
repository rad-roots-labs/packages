<script lang="ts">
    import { Glyph, type ICb } from "$root";
    import { type GlyphKey } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: ICb & {
            label: string;
            glyph?: GlyphKey;
            ring?: boolean;
        };
        children?: Snippet;
    } = $props();
</script>

<div class={`flex flex-col w-full gap-1 justify-center items-center`}>
    <button
        class={`flex flex-row h-12 w-12 p-2 justify-center items-center rounded-2xl bg-layer-1-surface ${basis.ring ? `ring-[4px] ring-layer-2-surface/40` : ``} el-re`}
        onclick={async () => {
            await basis.callback();
        }}
    >
        {#if basis.glyph}
            <Glyph
                basis={{
                    classes: `text-layer-0-glyph/80`,
                    dim: `sm`,

                    key: basis.glyph,
                }}
            />
        {:else if children}
            {@render children()}
        {/if}
    </button>
    <p class={`font-sans font-[400] text-sm text-layer-0-glyph el-re`}>
        {basis.label}
    </p>
</div>

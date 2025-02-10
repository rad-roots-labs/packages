<script lang="ts">
    import { Glyph, LoadSymbol } from "$root";
    import {
        type GeometryScreenPositionHorizontal,
        type ICb,
        type IGlyphKey,
        type ILoadingOpt,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: ICb &
            ILoadingOpt &
            IGlyphKey & {
                posx: Omit<GeometryScreenPositionHorizontal, "center">;
            };
    } = $props();
</script>

<div class={`absolute top-10 ${basis.posx}-6 flex flex-row`}>
    <button
        class={`flex flex-row h-12 w-12 justify-center items-center bg-layer-1-surface rounded-full el-re`}
        onclick={basis.callback}
    >
        {#if basis.loading}
            <LoadSymbol />
        {:else}
            <Glyph
                basis={{
                    classes: `text-layer-0-glyph`,
                    dim: `sm+`,

                    key: basis.glyph,
                }}
            />
        {/if}
    </button>
</div>
<div class="hidden left-6 right-6"></div>

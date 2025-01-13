<script lang="ts">
    import {
        Glyph,
        LoadSymbol,
        type GeometryScreenPositionHorizontal,
        type ICb,
        type IGlyphKey,
        type ILoadingOpt,
    } from "$lib";

    export let basis: ICb &
        ILoadingOpt &
        IGlyphKey & {
            posx: Omit<GeometryScreenPositionHorizontal, "center">;
        };
</script>

<div class={`absolute top-16 ${basis.posx}-6 flex flex-row`}>
    <button
        class={`flex flex-row h-12 w-12 justify-center items-center bg-layer-1-surface rounded-full el-re`}
        on:click={basis.callback}
    >
        {#if basis.loading}
            <LoadSymbol />
        {:else}
            <Glyph
                basis={{
                    classes: `text-layer-0-glyph`,
                    dim: `sm+`,
                    weight: `bold`,
                    key: basis.glyph,
                }}
            ></Glyph>
        {/if}
    </button>
</div>
<div class="hidden left-6 right-6"></div>

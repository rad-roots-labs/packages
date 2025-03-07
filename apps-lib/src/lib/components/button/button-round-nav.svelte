<script lang="ts">
    import { Glyph, LoadSymbol, type IButtonNavRound } from "$root";

    let { basis }: { basis: IButtonNavRound } = $props();
</script>

<button
    class={`flex flex-row h-12 w-12 justify-center items-center bg-layer-1-surface rounded-full el-re`}
    disabled={!!basis.disabled}
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

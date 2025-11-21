<script lang="ts">
    import { LoadSymbol } from "$lib";
    import type { IButtonNavRound } from "$lib/types/components/lib";
    import { Glyph } from "@radroots/apps-lib";

    let { basis }: { basis: IButtonNavRound } = $props();
</script>

<button
    class={`flex flex-row h-12 w-12 justify-center items-center bg-ly1 rounded-full el-re`}
    disabled={!!basis.disabled}
    onclick={basis.callback}
>
    {#if basis.loading}
        <LoadSymbol />
    {:else}
        <Glyph
            basis={{
                classes: `text-ly0-gl`,
                dim: `sm+`,

                key: basis.glyph,
            }}
        />
    {/if}
</button>

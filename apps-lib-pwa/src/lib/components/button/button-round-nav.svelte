<script lang="ts">
    import type { IButtonNavRound } from "$lib/types/components/lib";
    import { Glyph } from "@radroots/apps-lib";
    import LoadCircle from "../lib/load-circle.svelte";

    let { basis }: { basis: IButtonNavRound } = $props();
</script>

<button
    class={`flex flex-row h-12 w-12 justify-center items-center bg-ly1 rounded-full el-re`}
    disabled={!!basis.disabled}
    onclick={basis.callback}
>
    {#if basis.loading}
        <LoadCircle />
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

<script lang="ts">
    import { app_lo } from "$lib/stores/app";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis?: {
            hidden: boolean;
        };
        children: Snippet;
    } = $props();
</script>

{#if !basis?.hidden}
    <div
        class={`z-10 absolute bottom-0 h-lo_bottom_button_${$app_lo} flex flex-col w-full px-4 gap-1 justify-start items-center`}
    >
        {@render children()}
    </div>
{/if}

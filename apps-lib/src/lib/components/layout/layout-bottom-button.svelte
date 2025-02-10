<script lang="ts">
    import { app_lo } from "$lib/store/app";
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div
    class={`z-10 absolute bottom-0 h-lo_bottom_button_${$app_lo} flex flex-row w-full px-4 justify-center items-center`}
>
    {@render children()}
</div>

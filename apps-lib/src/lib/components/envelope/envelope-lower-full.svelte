<script lang="ts">
    import type { Snippet } from "svelte";
    import { quintInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    let {
        basis,
        children,
    }: {
        basis: {
            visible: boolean;
        };
        children: Snippet;
    } = $props();
</script>

{#if basis.visible}
    <div
        in:fly={{ y: `100%`, easing: quintInOut }}
        out:fly={{ y: `100%`, easing: quintInOut }}
        class={`z-50 absolute bottom-0 left-0 flex flex-col h-[100vh] w-full justify-start items-start bg-transparent el-re`}
    >
        <div
            class={`z-[100] [flex flex-col h-full w-full justify-start items-center overflow-y-scroll overflow-x-hidden scroll-hide el-re`}
        >
            {@render children()}
        </div>
    </div>
{/if}

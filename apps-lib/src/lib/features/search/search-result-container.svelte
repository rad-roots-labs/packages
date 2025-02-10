<script lang="ts">
    import type { ICb } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: ICb;
        children: Snippet;
    } = $props();
</script>

<button
    onclick={async () => {
        await basis.callback();
    }}
    class={`group flex flex-row h-[4rem] w-full px-4 justify-between items-center bg-layer-1-surface round-24 layer-1-active-surface el-re`}
>
    {@render children()}
</button>

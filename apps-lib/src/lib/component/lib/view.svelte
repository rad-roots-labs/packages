<script lang="ts">
    import { fade } from "svelte/transition";

    export let key: string;
</script>

<div
    in:fade={{ duration: 200 }}
    out:fade={{ delay: 50, duration: 200 }}
    data-view={key}
    class={`hidden flex flex-col h-full w-full justify-start items-center`}
>
    <slot />
</div>

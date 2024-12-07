<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div
    class={`flex flex-row justify-start items-center`}
    in:fade={{ duration: 200 }}
    out:fade={{ delay: 50, duration: 200 }}
>
    <slot />
</div>

<script lang="ts">
    import { app_splash, LogoCircle } from "$lib";
    import { fade } from "svelte/transition";
</script>

{#if $app_splash}
    <div
        in:fade={{ duration: 200 }}
        out:fade={{ delay: 50, duration: 200 }}
        class={`z-50 flex flex-row h-[100vh] w-full justify-center items-center bg-layer-0-surface`}
    >
        <LogoCircle />
    </div>
{/if}

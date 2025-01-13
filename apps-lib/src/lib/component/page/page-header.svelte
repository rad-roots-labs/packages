<script lang="ts">
    import {
        app_layout,
        callback_route,
        Empty,
        ph_blur,
        type IPageHeader,
    } from "$lib";
    import { fade } from "svelte/transition";

    export let basis: IPageHeader;
</script>

{#if $ph_blur}
    <div
        in:fade={{ duration: 50 }}
        out:fade={{ delay: 50, duration: 200 }}
        class={`z-20 fixed top-0 left-0 flex flex-row h-nav_${$app_layout} w-full justify-center items-center bg-layer-0-surface-blur/30 backdrop-blur-lg`}
    >
        <Empty></Empty>
    </div>
{/if}
<div
    class={`z-20 sticky top-0 flex flex-row w-full pb-4 px-6 justify-between items-center`}
>
    <div class={`flex flex-row justify-start items-center`}>
        <button
            class={`flex flex-row gap-1 justify-center items-center`}
            on:click={async () => {
                await callback_route(basis.callback_route);
            }}
        >
            <p
                class={`font-sansd font-[700] text-2xl text-layer-0-glyph capitalize`}
            >
                {basis.label || ``}
            </p>
        </button>
    </div>
    <slot name="header-option" />
</div>

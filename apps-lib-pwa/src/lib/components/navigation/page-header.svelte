<script lang="ts">
    import { app_lo, ph_blur } from "$lib/stores/app";
    import type { IPageHeader } from "$lib/types/components";
    import { callback_route, Flex } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    let {
        basis,
        children,
    }: {
        basis: IPageHeader<string>;
        children?: Snippet;
    } = $props();
</script>

{#if $ph_blur}
    <div
        in:fade={{ duration: 50 }}
        out:fade={{ delay: 50, duration: 200 }}
        class={`z-20 fixed top-0 left-0 flex flex-row h-nav_page_header_${$app_lo} w-full justify-center items-center bg-ly0-blur/30 backdrop-blur-lg`}
    >
        <Flex />
    </div>
{/if}
<div
    class={`z-20 sticky top-0 flex flex-row min-h-nav_page_header_${$app_lo} h-nav_page_header_${$app_lo} w-full px-6 justify-between items-center`}
>
    <div class={`flex flex-row justify-start items-center`}>
        <button
            class={`flex flex-row justify-center items-center`}
            onclick={async () => {
                if (basis.callback_route)
                    await callback_route(basis.callback_route);
            }}
        >
            <p
                class={`font-sansd font-[700] text-2xl text-ly0-gl capitalize max-w-lo_${$app_lo} truncate`}
            >
                {basis.label || ``}
            </p>
        </button>
    </div>
    {#if children}
        {#if !$ph_blur}
            <div
                in:fade={{ duration: 50 }}
                out:fade={{ delay: 50, duration: 200 }}
                class={`flex flex-row justify-center items-center`}
            >
                {@render children()}
            </div>
        {/if}
    {/if}
</div>

<script lang="ts">
    import { app_layout, Fill, ph_blur, route, type IPageHeader } from "$lib";
    import { fade } from "svelte/transition";

    export let basis: IPageHeader;
</script>

{#if $ph_blur}
    <div
        in:fade={{ duration: 200 }}
        out:fade={{ delay: 50, duration: 200 }}
        class={`z-20 fixed top-0 left-0 flex flex-row h-nav_${$app_layout} w-full justify-center items-center bg-layer-0-surface-blur/40 backdrop-blur-lg border-b-line border-layer-0-surface-edge/30`}
    >
        <Fill />
    </div>
{/if}
<div
    class={`z-20 sticky top-0 flex flex-row w-full pb-4 px-6 justify-between items-center`}
>
    <div class={`flex flex-row justify-start items-center`}>
        {#if typeof basis.label === `string`}
            <p
                class={`font-sansd font-[600] text-2xl text-layer-0-glyph capitalize`}
            >
                {basis.label || ``}
            </p>
        {:else}
            <button
                class={`flex flex-row gap-1 justify-center items-center`}
                on:click={async () => {
                    if (typeof basis.label !== `string`) {
                        if (basis.callback_route) {
                            const route_to = await basis.callback_route();
                            if (!route_to) return;
                            await route(route_to);
                            return;
                        }
                        await route(
                            basis.label[1].route,
                            basis.label[1].route_param || undefined,
                        );
                    }
                }}
            >
                <p
                    class={`font-sansd font-[600] text-2xl text-layer-0-glyph capitalize`}
                >
                    {basis.label[0] || ``}
                </p>
            </button>
        {/if}
    </div>
    <slot name="option" />
</div>

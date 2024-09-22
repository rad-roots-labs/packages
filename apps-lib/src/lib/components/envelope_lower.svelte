<script lang="ts">
    import { Fill, t, type CallbackPromise } from "$lib";
    import { quintInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    export let basis: {
        visible: boolean;
        close: CallbackPromise;
    };

    $: basis = basis;
</script>

{#if basis.visible}
    <div
        in:fly={{ y: `100%`, easing: quintInOut }}
        out:fly={{ y: `100%`, easing: quintInOut }}
        class={`z-20 absolute bottom-0 left-0 flex flex-col h-[calc(100vh-30px)] w-full justify-start items-start bg-layer-1-surface rounded-t-2xl overflow-y-scroll scroll-hide`}
    >
        <div
            class={`sticky top-0 left-0 grid grid-cols-12 flex flex-row h-12 w-full px-4 pb-2 justify-center items-center bg-layer-1-surface/60 backdrop-blur-md`}
        >
            <div
                class={`col-span-4 flex flex-row h-full justify-start items-end`}
            >
                <button
                    class={`flex flex-row justify-center items-center`}
                    on:click={async () => {
                        await basis.close();
                    }}
                >
                    <p class={`font-sans font-[500] text-layer-1-glyph-hl`}>
                        {`${$t(`common.cancel`)}`}
                    </p>
                </button>
            </div>
            <div
                class={`col-span-4 flex flex-row h-full pt-3 justify-center items-start`}
            >
                <div
                    class={`flex flex-row justify-start items-center h-1 w-10 rounded-full bg-layer-2-surface-edge`}
                />
            </div>
            <div class={`col-span-4 flex flex-row justify-start items-center`}>
                <Fill />
            </div>
        </div>
        <slot />
    </div>
{/if}

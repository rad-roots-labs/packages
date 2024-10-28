<script lang="ts">
    import { app_tilt, Fill, t, type CallbackPromise } from "$lib";
    import { quintInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    export let basis: {
        visible: boolean;
        close: CallbackPromise;
        label_close?: string | true;
    };
    $: basis = basis;

    $: if (basis.visible) {
        app_tilt.set(true);
    }

    const handle_close = async (): Promise<void> => {
        try {
            app_tilt.set(false);
            await basis.close();
        } catch (e) {
            console.log(`(error) handle_close `, e);
        }
    };
</script>

{#if basis.visible}
    <div
        in:fly={{ y: `100%`, easing: quintInOut }}
        out:fly={{ y: `100%`, easing: quintInOut }}
        class={`z-20 absolute bottom-0 left-0 flex flex-col h-[100vh] w-full justify-start items-start`}
    >
        <button
            class={`flex flex-row h-[12%] w-full justify-center items-center text-white`}
            on:click={async () => {
                await handle_close();
            }}
        >
            <Fill />
        </button>
        <div
            class={`flex flex-col h-[calc(100vh-12%)] w-full justify-start justify-start items-start bg-layer-1-surface rounded-t-2xl`}
        >
            <div
                class={`sticky top-0 left-0 grid grid-cols-12 flex flex-row h-12 w-full px-4 pb-2 justify-center items-center bg-layer-1-surface/60 backdrop-blur-md`}
            >
                <div
                    class={`col-span-4 flex flex-row h-full justify-start items-end`}
                >
                    {#if basis.label_close}
                        <button
                            class={`flex flex-row justify-center items-center`}
                            on:click={async () => {
                                await handle_close();
                            }}
                        >
                            <p
                                class={`font-sans font-[500] text-layer-1-glyph-hl`}
                            >
                                {typeof basis.label_close === `string`
                                    ? basis.label_close
                                    : `${$t(`common.cancel`)}`}
                            </p>
                        </button>
                    {:else}
                        <Fill />
                    {/if}
                </div>
                <button
                    class={`col-span-4 flex flex-row h-full pt-3 justify-center items-start`}
                    on:click={async () => {
                        await handle_close();
                    }}
                >
                    <div
                        class={`flex flex-row justify-start items-center h-1 w-10 rounded-full bg-layer-2-surface-edge`}
                    />
                </button>
                <div
                    class={`col-span-4 flex flex-row justify-start items-center`}
                >
                    <Fill />
                </div>
            </div>
            <div
                class={`flex flex-col w-full justify-start items-center overflow-y-scroll overflow-x-hidden scroll-hide`}
            >
                <slot />
            </div>
        </div>
    </div>
{/if}

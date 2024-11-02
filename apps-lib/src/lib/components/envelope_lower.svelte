<script lang="ts">
    import { envelope_visible, Fill, t, type CallbackPromise } from "$lib";
    import { quintInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    let el_c: HTMLDivElement;

    let el_c_scrolled = false;

    export let basis: {
        close: CallbackPromise;
        label_close?: string | true;
    };
    $: basis = basis;

    const handle_close = async (): Promise<void> => {
        try {
            envelope_visible.set(false);
            await basis.close();
        } catch (e) {
            console.log(`(error) handle_close `, e);
        }
    };

    const handle_scroll = (): void => {
        if (el_c.scrollTop > 10) el_c_scrolled = true;
        else el_c_scrolled = false;
    };
</script>

{#if $envelope_visible}
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
            class={`relative flex flex-col h-[calc(100vh-12%)] w-full justify-start justify-start items-start bg-layer-1-surface rounded-t-2xl overflow-hidden`}
        >
            <div
                class={`absolute z-10 top-0 left-0 grid grid-cols-12 flex flex-row h-12 w-full px-4 pb-2 justify-center items-center ${el_c_scrolled ? `bg-layer-1-surface/30  backdrop-blur-lg` : ``} el-re`}
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
                bind:this={el_c}
                on:scroll={handle_scroll}
                class={`flex flex-col w-full pt-12 justify-start items-center overflow-y-scroll overflow-x-hidden scroll-hide`}
            >
                <slot />
            </div>
        </div>
    </div>
{/if}

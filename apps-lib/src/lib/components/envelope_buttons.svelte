<script lang="ts">
    import type { CallbackPromise } from "$lib/types/client";
    import { fmt_cl } from "$lib/utils/client";
    import { quintInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    export let basis: {
        visible: boolean;
        buttons: {
            classes?: string;
            label: string;
            callback: CallbackPromise;
        }[];
    };

    $: basis = basis;
</script>

{#if basis.visible}
    <div
        in:fly={{ y: `100`, easing: quintInOut }}
        out:fly={{ y: `100`, easing: quintInOut }}
        class={`z-20 absolute bottom-0 left-0 flex flex-col w-full px-4 pb-4 gap-3 justify-start items-center`}
    >
        {#each basis.buttons as button}
            <button
                class={`flex flex-row h-envelope_button w-full justify-center items-center bg-layer-2-surface active:bg-layer-2-surface_a rounded-2xl`}
                on:click={async () => {
                    await button.callback();
                }}
            >
                <p class={`${fmt_cl(button.classes)} font-sans `}>
                    {button.label}
                </p>
            </button>
        {/each}
    </div>
{/if}

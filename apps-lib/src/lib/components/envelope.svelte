<script lang="ts">
    import {
        Fill,
        fmt_cl,
        parse_layer,
        sleep,
        type IEnvelopeBasis,
    } from "$lib";
    import { quintInOut } from "svelte/easing";
    import { writable } from "svelte/store";
    import { slide } from "svelte/transition";
    import EnvelopeTitled from "./envelope_titled.svelte";

    export let basis: IEnvelopeBasis;
    $: basis = basis;

    $: layer = parse_layer(basis.layer, 1);

    let envelope_toggle = writable<boolean>(false);
    let envelope_visible = false;

    $: {
        envelope_toggle.set(basis.visible);
    }

    envelope_toggle.subscribe(async (envelope_toggle) => {
        if (envelope_toggle) {
            await sleep(100);
            envelope_visible = true;
        } else {
            envelope_visible = false;
        }
    });
</script>

<div
    class={`z-50 modal modal-bottom ${basis.visible ? `modal-open` : ``} m-0 p-0 backdrop-blur-sm`}
>
    <div class={`modal-box h-[100vh] m-0 p-0 bg-transparent`}>
        <div class={`flex flex-col h-full w-full justify-end items-end`}>
            <button
                class={`flex flex-grow w-full`}
                on:click={async () => {
                    if (basis.close) await basis.close();
                }}
            >
                <Fill />
            </button>
            {#if envelope_visible}
                <div
                    class={`${fmt_cl(basis.classes)} relative flex flex-col w-full`}
                    in:slide={{
                        axis: `y`,
                        duration: 250,
                        easing: quintInOut,
                    }}
                >
                    {#if `titled` in basis && basis.titled}
                        <EnvelopeTitled
                            basis={basis.titled}
                            callback_close={basis.close}
                            {layer}
                        >
                            {#if $$slots.default}
                                <slot />
                            {/if}
                        </EnvelopeTitled>
                    {:else if $$slots.el}
                        <slot name="el" />
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

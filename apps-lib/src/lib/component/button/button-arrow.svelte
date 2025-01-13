<script lang="ts">
    import { Glyph, type CallbackPromise } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: {
        label: string;
        callback: CallbackPromise;
    };

    let visible_action = false;

    onMount(async () => {
        try {
            document.addEventListener("click", () => toggle(false));
        } catch (e) {
        } finally {
        }
    });

    onDestroy(() => {
        document.removeEventListener("click", () => toggle(false));
    });

    const toggle = (toggle_force?: boolean): void => {
        visible_action =
            typeof toggle_force === `boolean` ? toggle_force : !visible_action;
    };
</script>

<div class={`relative inline-block`}>
    <button
        class={`flex flex-row w-auto h-10 gap-1 justify-center items-center el-re`}
        on:click|stopPropagation={async () => {
            toggle();
        }}
    >
        <button
            class={`${visible_action ? `fade-in` : `hidden`} absolute top-0 left-0 flex flex-row h-full justify-start items-center el-re`}
            on:click|stopPropagation={async () => {
                await basis.callback();
            }}
        >
            <Glyph
                basis={{
                    classes: `text-layer-0-glyph`,
                    dim: `sm`,
                    weight: `bold`,
                    key: `arrow-left`,
                }}
            />
        </button>
        <p
            class={`font-circ font-[700] text-layer-0-glyph text-[1.6rem] tracking-tight ${visible_action ? `translate-x-8` : ``} duration-[350ms] el-re`}
        >
            {basis.label || ``}
        </p>
    </button>
</div>

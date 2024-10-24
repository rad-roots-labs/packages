<script lang="ts">
    import { Fill, Glyph, type CallbackPromise, type IClOpt } from "$lib";
    import { onDestroy, onMount } from "svelte";
    import { slide } from "svelte/transition";

    export let basis: IClOpt & {
        label: string;
        list: {
            label: string;
            callback: CallbackPromise;
            active: boolean;
        }[];
    };

    let visible_menu = false;

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
        visible_menu =
            typeof toggle_force === `boolean` ? toggle_force : !visible_menu;
    };
</script>

<div class={`relative inline-block`}>
    <button
        class={`group flex flex-row h-[2rem] ${visible_menu ? `w-[160px] pl-8 pr-3` : `w-[90px] pl-3 pr-3`} gap-[0.5rem] justify-between items-center bg-layer-0-surface_w rounded-t-touch ${visible_menu ? `` : `rounded-b-touch`} border-line border-layer-0-surface-edge el-re`}
        on:click|stopPropagation={async () => {
            toggle();
        }}
    >
        <p
            class={`font-circ font-[400] text-layer-1-glyph text-sm tracking-wide`}
        >
            {basis.label || ``}
        </p>
        <Glyph
            basis={{
                classes: `text-layer-1-glyph ${visible_menu ? `rotate-90` : ``} duration-[350ms] el-re`,
                dim: `xs`,
                weight: `bold`,
                key: `caret-down`,
            }}
        />
    </button>
    {#if visible_menu}
        <div
            class={`z-[20] absolute left-0 w-full bg-base-100 rounded-b-touch border-b-line border-l-line border-r-line border-layer-0-surface-edge overflow-hidden`}
            in:slide={{ duration: 350 }}
            out:slide={{ duration: 150 }}
        >
            <div
                class={`z-[20] flex flex-col w-full justify-center items-start`}
            >
                {#each basis.list as li}
                    <button
                        class={`group flex flex-row h-[2rem] w-full first:pt-1 last:pb-1 pl-1 pr-1 gap-[0.5rem] justify-start items-center overflow-hidden active:bg-layer-0-surface_a/40 el-re`}
                        on:click|stopPropagation={async () => {
                            toggle(false);
                            await li.callback();
                        }}
                    >
                        <div
                            class={`flex flex-row w-5 justify-end items-center`}
                        >
                            {#if li.active}
                                <Glyph
                                    basis={{
                                        classes: `text-layer-1-glyph`,
                                        dim: `xs-`,
                                        weight: `bold`,
                                        key: `check`,
                                    }}
                                />
                            {:else}
                                <Fill />
                            {/if}
                        </div>
                        <p
                            class={`font-circ font-[400] text-layer-1-glyph text-sm tracking-wide group-active:opacity-60 el-re`}
                        >
                            {li.label || ``}
                        </p>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

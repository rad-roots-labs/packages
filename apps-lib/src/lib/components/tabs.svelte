<script lang="ts">
    import {
        Glyph,
        type ITabsBasis,
        app_layout,
        fmt_cl,
        sleep,
        tabs_active,
        tabs_blur,
        tabs_visible,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: ITabsBasis;
    $: basis = basis;

    $: classes_blur = $tabs_blur ? `bg-layer-1-surface/30` : ``;

    let tab_focus: number | null = null;

    let el: HTMLElement | null;
    let el_inner: HTMLElement | null;

    onMount(async () => {
        try {
            tabs_visible.set(true);
        } catch (e) {
        } finally {
        }
    });

    onDestroy(async () => {
        try {
            tabs_visible.set(false);
        } catch (e) {
        } finally {
        }
    });
</script>

<div
    bind:this={el}
    class={`${fmt_cl(basis?.classes)} z-10 absolute bottom-0 left-0 flex flex-col w-full justify-start items-start bg-layer-0-surface/40 backdrop-blur-md h-tabs_${$app_layout} ${classes_blur} el-re`}
>
    <div
        bind:this={el_inner}
        class={`relative flex flex-col h-full w-full justify-start items-start`}
    >
        <div
            class={`absolute top-3 left-0 grid grid-cols-12 flex flex-row w-full justify-center items-center`}
        >
            {#if $$slots.default}
                <slot />
            {:else}
                {#each basis?.list || [] as tab, tab_i}
                    <button
                        class={`group col-span-3 flex flex-col h-full gap-[2px] justify-start items-center el-re`}
                        on:click={async () => {
                            tab_focus = tab_i;
                            if (!tab.hide_active) tabs_active.set(tab_i);
                            await tab.callback(tab_i);
                            await sleep(150);
                            tab_focus = null;
                        }}
                    >
                        <Glyph
                            basis={{
                                classes:
                                    !basis.hide_active && $tabs_active === tab_i
                                        ? `text-layer-1-glyph text-lineActiveBlue`
                                        : `text-layer-1-glyph text-lineMd`,
                                key: tab.icon,
                                dim: `md`,
                                weight: tab.force_weight
                                    ? tab.force_weight
                                    : typeof tab_focus === `number` &&
                                        tab_focus === tab_i
                                      ? `fill`
                                      : !basis.hide_active &&
                                          $tabs_active === tab_i
                                        ? tab.active_weight || `fill`
                                        : `bold`,
                            }}
                        />
                        <p
                            class={`font-circ font-[400] text-layer-1-glyph text-xs tracking-tight`}
                        >
                            {tab.label || ``}
                        </p>
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</div>

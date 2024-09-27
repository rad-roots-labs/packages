<script lang="ts">
    import {
        Glyph,
        type ITabsBasis,
        app_layout,
        app_tab_active,
        fmt_cl,
        sleep,
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
    class={`${fmt_cl(basis?.classes)} z-10 absolute bottom-0 left-0 flex flex-col w-full justify-start items-start transition-all backdrop-blur-md h-tabs_${$app_layout} ${classes_blur}`}
>
    <div
        bind:this={el_inner}
        class={`relative flex flex-col h-full w-full justify-start items-center`}
    >
        <div
            class={`absolute top-4 left-0 grid grid-cols-12 flex flex-row w-full justify-center items-center`}
        >
            {#if $$slots.default}
                <slot />
            {:else}
                {#each basis?.list || [] as tab, tab_i}
                    <button
                        class={`col-span-3 flex flex-col h-full justify-start items-center transition-all`}
                        on:click={async () => {
                            tab_focus = tab_i;
                            if (!tab.hide_active) app_tab_active.set(tab_i);
                            await tab.callback(tab_i);
                            await sleep(150);
                            tab_focus = null;
                        }}
                    >
                        <Glyph
                            basis={{
                                classes:
                                    !basis.hide_active &&
                                    $app_tab_active === tab_i
                                        ? `text-layer-2-glyph text-lineActiveBlue`
                                        : `text-layer-2-glyph text-lineMd`,
                                key: tab.icon,
                                dim: `md`,
                                weight: tab.force_weight
                                    ? tab.force_weight
                                    : typeof tab_focus === `number` &&
                                        tab_focus === tab_i
                                      ? `fill`
                                      : !basis.hide_active &&
                                          $app_tab_active === tab_i
                                        ? tab.active_weight || `fill`
                                        : `bold`,
                            }}
                        />
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</div>

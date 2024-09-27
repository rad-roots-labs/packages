<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        app_layout,
        encode_qp_route,
        Fill,
        fmt_cl,
        Glyph,
        nav_blur,
        nav_prev,
        nav_visible,
        type INavBasis,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";
    import NavOption from "./nav_option.svelte";

    export let basis: INavBasis;
    $: basis = basis;

    let el: HTMLElement | null;
    let el_inner: HTMLElement | null;

    let nav_prev_label = ``;

    onMount(async () => {
        try {
            nav_visible.set(true);
            if ($nav_prev.length)
                nav_prev_label = $nav_prev[$nav_prev.length - 1].label || ``;
        } catch (e) {
        } finally {
        }
    });

    onDestroy(async () => {
        try {
            nav_visible.set(false);
        } catch (e) {
        } finally {
        }
    });
</script>

<div
    bind:this={el}
    class={`z-10 absolute top-0 left-0 flex flex-col w-full justify-start items-start transition-all duration-[250ms] h-nav_${$app_layout} ${$nav_blur ? `bg-layer-0-surface-blur/30 backdrop-blur-md` : ``}`}
>
    <div
        bind:this={el_inner}
        class={`relative flex flex-col h-full w-full justify-end items-center bg-transparent`}
    >
        <div
            class={`absolute bottom-[5px] left-0 grid grid-cols-12 flex flex-row h-8 w-full justify-start items-center`}
        >
            <button
                class={`group col-span-4 flex flex-row h-full pl-2 justify-start items-center`}
                on:click={async () => {
                    if (basis.prev.callback) await basis.prev.callback();
                    let route_to =
                        typeof basis.prev.route === `string`
                            ? basis.prev.route
                            : encode_qp_route(
                                  basis.prev.route[0],
                                  basis.prev.route[1],
                              );
                    if ($nav_prev.length) {
                        const nav_prev_li = $nav_prev.pop();
                        if (nav_prev_li)
                            route_to = encode_qp_route(
                                nav_prev_li.route,
                                nav_prev_li.params,
                            );
                    }
                    await goto(route_to);
                }}
            >
                <Glyph
                    basis={{
                        key: `caret-left`,
                        weight: `bold`,
                        dim: `md+`,
                        classes: `text-layer-1-glyph-hl group-active:opacity-70 transition-opacity`,
                    }}
                />
                {#if nav_prev_label || basis.prev.label}
                    <p
                        class={`font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                    >
                        {nav_prev_label || basis.prev.label}
                    </p>
                {:else}
                    <Fill />
                {/if}
            </button>
            <div
                class={`col-span-4 flex flex-row h-full justify-center items-center`}
            >
                {#if basis.title}
                    <button
                        class={`flex flex-row justify-center items-center`}
                        on:click={async () => {
                            if (basis.title.callback)
                                await basis.title.callback();
                        }}
                    >
                        {#if `value` in basis.title.label}
                            <p
                                class={`${fmt_cl(basis.title.label.classes)} font-sans text-navCurrent text-layer-1-glyph`}
                            >
                                {basis.title.label.value}
                            </p>
                        {/if}
                    </button>
                {:else}
                    <Fill />
                {/if}
            </div>
            <div
                class={`col-span-4 flex flex-row h-full justify-end items-center`}
            >
                {#if basis.option}
                    <NavOption basis={basis.option} />
                {:else}
                    <Fill />
                {/if}
            </div>
        </div>
    </div>
</div>

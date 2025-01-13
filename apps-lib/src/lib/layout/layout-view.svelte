<script lang="ts">
    import {
        app_layout,
        fmt_cl,
        layout_view_cover,
        nav_blur,
        ph_blur,
        tabs_blur,
        type IBasisOpt,
        type IClOpt,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: IBasisOpt<IClOpt & { fade?: boolean }> = undefined;
    let el: HTMLElement | null;

    /*$: classes_resp = $layout_view_cover
        ? ``
        : $nav_visible
          ? `pt-h_nav_${$app_layout}`
          : `pt-h_lo_view_${$app_layout}`;
        */
    onMount(async () => {
        try {
            el?.addEventListener("scroll", scrollChange);
        } catch (e) {
        } finally {
        }
    });

    onDestroy(async () => {
        try {
            el?.removeEventListener("scroll", scrollChange);
        } catch (e) {
        } finally {
        }
    });

    const scrollChange = (): void => {
        if (Math.max(el?.scrollTop || 0, 0) > 10) nav_blur.set(true);
        else nav_blur.set(false);
        if (Math.max(el?.scrollTop || 0, 0) > 10) tabs_blur.set(true);
        else tabs_blur.set(false);
        if (Math.max(el?.scrollTop || 0, 0) > 30) ph_blur.set(true);
        else ph_blur.set(false);
    };
</script>

<div
    bind:this={el}
    class={`${fmt_cl(basis?.classes)} absolute top-0 left-0 flex flex-col h-[100vh] w-full justify-start items-center overflow-y-scroll scroll-hide ${$layout_view_cover ? `` : `pt-h_lo_view_${$app_layout}`}`}
    class:fade-in={basis?.fade}
>
    <slot />
</div>

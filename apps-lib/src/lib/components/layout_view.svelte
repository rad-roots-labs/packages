<script lang="ts">
    import {
        app_layout,
        fmt_cl,
        layout_view_cover,
        nav_blur,
        nav_visible,
        ph_blur,
        tabs_blur,
        tabs_visible,
        type AppLayoutKey,
        type IClOpt,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    const styles: Record<AppLayoutKey, string> = {
        mobile_base: "pt-4",
        mobile_y: "pt-16 pb-10",
    };

    export let basis: (IClOpt & { fade?: boolean }) | undefined = undefined;
    let el: HTMLElement | null;

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
        if (Math.max(el?.scrollTop || 0, 0) > 50) ph_blur.set(true);
        else ph_blur.set(false);
    };
</script>

<div
    bind:this={el}
    class={`${fmt_cl(basis?.classes)} absolute top-0 left-0 flex flex-col h-[100vh] w-full justify-start items-center overflow-y-scroll scroll-hide ${
        $layout_view_cover
            ? ``
            : $nav_visible
              ? `pt-h_nav_${$app_layout} ${styles[$app_layout]}`
              : `` //styles[$app_layout]
    } ${$layout_view_cover ? `` : $tabs_visible ? `pb-h_tabs_${$app_layout}` : ``} `}
    class:fade-in={basis?.fade}
>
    <slot />
</div>

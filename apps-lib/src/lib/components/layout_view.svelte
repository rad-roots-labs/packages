<script lang="ts">
    import {
        type AppLayoutKey,
        type IClOpt,
        app_layout,
        fmt_cl,
        nav_blur,
        nav_visible,
        tabs_blur,
        tabs_visible,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    const styles: Record<AppLayoutKey, string> = {
        base: "pt-4",
        lg: "pt-16",
    };

    export let basis:
        | (IClOpt & { fade?: boolean; hide_padding?: boolean })
        | undefined = undefined;
    $: basis = basis;

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

    $: classes_nav = $nav_visible
        ? `pt-h_nav_${$app_layout}`
        : styles[$app_layout];
    $: classes_tabs = $tabs_visible ? `pb-h_tabs_${$app_layout}` : ``;
    $: classes_fade = basis?.fade ? `fade-in` : ``;

    const scrollChange = (): void => {
        if (Math.max(el?.scrollTop || 0, 0) > 10) nav_blur.set(true);
        else nav_blur.set(false);
        if (Math.max(el?.scrollTop || 0, 0) > 10) tabs_blur.set(true);
        else tabs_blur.set(false);
    };
</script>

<div
    bind:this={el}
    class={`${fmt_cl(basis?.classes)} absolute top-0 left-0 flex flex-col h-[100vh] w-full overflow-y-scroll scroll-hide ${!basis?.hide_padding ? classes_nav : ``} ${classes_tabs} ${classes_fade}`}
>
    <slot />
</div>

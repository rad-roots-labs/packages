<script lang="ts">
    import {
        type AppLayoutKey,
        type IClOpt,
        app_layout,
        fmt_cl,
        nav_blur,
        tabs_blur,
    } from "$lib";
    import { onDestroy, onMount } from "svelte";

    const styles: Record<AppLayoutKey, string> = {
        mobile_base: "pt-4",
        mobile_y: "pt-16 pb-10",
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
    class={`${fmt_cl(basis?.classes)} absolute top-0 left-0 flex flex-col h-[100vh] w-full justify-center items-center ${classes_fade}`}
>
    <div
        class={`flex flex-col h-view_${$app_layout} w-full justify-start items-start overflow-y-scroll scroll-hide -translate-y-h_view_offset_${$app_layout}`}
    >
        <slot />
    </div>
</div>

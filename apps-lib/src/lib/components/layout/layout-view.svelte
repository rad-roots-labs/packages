<script lang="ts">
    import { nav_blur, ph_blur, tabs_blur } from "$root";
    import { fmt_cl, type IBasisOpt, type IClOpt } from "@radroots/util";
    import { onDestroy, onMount, type Snippet } from "svelte";

    let {
        basis = undefined,
        el = $bindable(null),
        children,
    }: {
        el?: HTMLDivElement | null;
        basis?: IBasisOpt<IClOpt & { fade?: boolean }>;
        children: Snippet;
    } = $props();

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

    //${$layout_view_cover ? `` : `pt-h_lo_view_${$app_lo}`}
</script>

<div
    bind:this={el}
    class={`${fmt_cl(basis?.classes)} absolute top-0 left-0 flex flex-col h-[100vh] w-full justify-start items-center scroll-hide overflow-auto`}
    class:fade-in={basis?.fade}
>
    {@render children()}
</div>

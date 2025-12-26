<script lang="ts">
    import type { ICarouselContainer } from "$lib/types/components/lib";
    import {
        CAROUSEL_CONTEXT_KEY,
        carousel_register_container,
        carousel_watch,
        fmt_cl,
        set_context,
    } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: ICarouselContainer<string>;
        children: Snippet;
    } = $props();

    if (basis.carousel) set_context(CAROUSEL_CONTEXT_KEY, basis.carousel);

    const view = $derived(basis.view ?? basis.carousel?.view ?? ``);

    const classes = $derived(
        `${fmt_cl(basis.classes)} carousel-container flex h-full w-full`,
    );

    let container_el: HTMLDivElement | null = $state(null);

    $effect(() => {
        if (!basis.carousel) return;
        return carousel_register_container(basis.carousel, container_el);
    });

    $effect(() => {
        if (!basis.carousel) return;
        return carousel_watch(basis.carousel);
    });
</script>

<div
    bind:this={container_el}
    data-carousel-container={view}
    class={classes}
>
    {@render children()}
</div>

<script lang="ts">
    import type { ICarouselContainer } from "$lib/types/components/lib";
    import {
        CAROUSEL_CONTEXT_KEY,
        carousel_register_container,
        carousel_watch,
        fmt_cl,
        set_context,
        type CarouselStore,
    } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";
    import { writable } from "svelte/store";

    let {
        basis,
        children,
    }: {
        basis: ICarouselContainer<string>;
        children: Snippet;
    } = $props();

    const carousel_context = writable<CarouselStore<string> | undefined>(
        undefined,
    );

    set_context(CAROUSEL_CONTEXT_KEY, carousel_context);

    const carousel = $derived(basis.carousel ?? undefined);

    $effect(() => {
        carousel_context.set(carousel);
    });

    const view = $derived(basis.view ?? carousel?.view ?? ``);

    const classes = $derived(
        `${fmt_cl(basis.classes)} carousel-container flex h-full w-full`,
    );

    let container_el: HTMLDivElement | null = $state(null);

    $effect(() => {
        if (!carousel) return;
        return carousel_register_container(carousel, container_el);
    });

    $effect(() => {
        if (!carousel) return;
        return carousel_watch(carousel);
    });
</script>

<div
    bind:this={container_el}
    data-carousel-container={view}
    class={classes}
>
    {@render children()}
</div>

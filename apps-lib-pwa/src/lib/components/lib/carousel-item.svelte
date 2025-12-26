<script lang="ts">
    import type {
        CarouselKeyboardEvent,
        CarouselMouseEvent,
        ICarouselItem,
    } from "$lib/types/components/lib";
    import type { CarouselStore } from "@radroots/apps-lib";
    import {
        CAROUSEL_CONTEXT_KEY,
        carousel_register_item,
        fmt_cl,
        get_context,
    } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";
    import { writable, type Writable } from "svelte/store";

    let {
        basis,
        children,
    }: {
        basis: ICarouselItem<string>;
        children: Snippet;
    } = $props();

    const carousel_context_fallback = writable<CarouselStore<string> | undefined>(
        undefined,
    );
    const carousel_context_store =
        get_context<Writable<CarouselStore<string> | undefined> | undefined>(
            CAROUSEL_CONTEXT_KEY,
        ) ?? carousel_context_fallback;

    const carousel_context_value = $derived($carousel_context_store);

    const carousel = $derived(basis.carousel ?? carousel_context_value);
    const view = $derived(basis.view ?? carousel?.view ?? ``);

    const classes = $derived(
        `${fmt_cl(basis.classes)} carousel-item flex flex-col h-full w-full`,
    );

    let item_el: HTMLDivElement | null = $state(null);

    $effect(() => {
        if (!carousel) return;
        return carousel_register_item(carousel, item_el);
    });

    const handle_click = async (ev: MouseEvent): Promise<void> => {
        if (!basis.callback_click) return;
        const event_cast = ev as CarouselMouseEvent;
        await basis.callback_click(event_cast);
    };

    const handle_keydown = async (ev: KeyboardEvent): Promise<void> => {
        if (!basis.callback_keydown) return;
        const event_cast = ev as CarouselKeyboardEvent;
        await basis.callback_keydown(event_cast);
    };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    bind:this={item_el}
    data-carousel-item={view}
    class={classes}
    role={basis.role ?? undefined}
    tabindex={basis.tabindex ?? undefined}
    onclick={handle_click}
    onkeydown={handle_keydown}
>
    {@render children()}
</div>

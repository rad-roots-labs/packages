<script lang="ts">
    import type {
        CarouselKeyboardEvent,
        CarouselMouseEvent,
        ICarouselItem,
    } from "$lib/types/components/lib";
    import { fmt_cl } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: ICarouselItem<string>;
        children: Snippet;
    } = $props();

    const classes = $derived(
        `${fmt_cl(basis.classes)} carousel-item flex flex-col h-full w-full`,
    );

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
    data-carousel-item={basis.view}
    class={classes}
    role={basis.role ?? undefined}
    tabindex={basis.tabindex ?? undefined}
    onclick={handle_click}
    onkeydown={handle_keydown}
>
    {@render children()}
</div>

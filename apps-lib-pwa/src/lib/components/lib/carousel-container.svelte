<script lang="ts">
    import type { ICarouselContainer } from "$lib/types/components/lib";
    import { fmt_cl } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: ICarouselContainer<string>;
        children: Snippet;
    } = $props();

    const classes = $derived(
        `${fmt_cl(basis.classes)} carousel-container flex h-full w-full`,
    );
</script>

<div data-carousel-container={basis.view} class={classes}>
    {@render children()}
</div>

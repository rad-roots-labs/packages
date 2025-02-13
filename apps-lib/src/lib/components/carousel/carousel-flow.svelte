<script lang="ts">
    import { browser } from "$app/environment";
    import { handle_err } from "$root";
    import { fmt_cl, type IClOpt } from "@radroots/util";
    import { onDestroy, onMount, type Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: IClOpt & {
            index: number;
            slide_duration?: number;
        };
        children: Snippet;
    } = $props();

    let el_parent: HTMLDivElement | null = $state(null);
    let duration: number = $state(basis.slide_duration ?? 500);
    let offset_w: number = $state(0);

    onMount(async () => {
        try {
            handle_resize();
            if (browser) window.addEventListener(`resize`, handle_resize);
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    onDestroy(async () => {
        try {
            if (browser) window.removeEventListener(`resize`, handle_resize);
        } catch (e) {
            handle_err(e, `on_destroy`);
        }
    });

    const handle_resize = (): void => {
        if (el_parent && el_parent.children.length > 0)
            offset_w = (el_parent.children[0] as HTMLElement).offsetWidth;
    };
</script>

<div class={`${fmt_cl(basis?.classes)}relative flex flex-col h-full w-full`}>
    <div
        bind:this={el_parent}
        class={`flex flex-grow transition-transform`}
        style={`transform: translateX(-${Math.max(basis?.index, 0) * offset_w}px); transition: transform ${duration}ms ease-out;`}
    >
        {@render children()}
    </div>
</div>

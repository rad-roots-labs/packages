<script lang="ts">
    import { casl_i } from "$root";
    import { fmt_cl, type IClOpt } from "@radroots/util";
    import { onMount, type Snippet } from "svelte";

    let {
        basis,
        el_parent = $bindable(null),
        children,
    }: {
        basis?: IClOpt;
        el_parent?: HTMLDivElement | null;
        children: Snippet;
    } = $props();

    let offset_w = $state(0);

    onMount(() => {
        if (el_parent && el_parent.children.length > 0)
            offset_w = (el_parent.children[0] as HTMLElement).offsetWidth;
    });

    window.addEventListener("resize", () => {
        if (el_parent && el_parent.children.length > 0)
            offset_w = (el_parent.children[0] as HTMLElement).offsetWidth;
    });
</script>

<div class={`${fmt_cl(basis?.classes)}relative flex flex-col h-full w-full`}>
    <div
        bind:this={el_parent}
        class="flex flex-grow transition-transform duration-500"
        style={`transform: translateX(-${Math.max($casl_i, 0) * offset_w}px)`}
    >
        {@render children()}
    </div>
</div>

<script lang="ts">
    import { fmt_cl } from "$lib/utils/app/lib";
    import type { Snippet } from "svelte";
    import { cubicIn, cubicOut } from "svelte/easing";
    import { fade, type FadeParams } from "svelte/transition";

    let {
        basis,
        children,
    }: {
        basis?: {
            in?: FadeParams;
            out?: FadeParams;
            classes?: string;
        };
        children: Snippet;
    } = $props();
</script>

<div
    in:fade={{
        duration: 200,
        easing: cubicIn,
        ...basis?.in,
    }}
    out:fade={{
        duration: 200,
        easing: cubicOut,
        ...basis?.out,
    }}
    class={`flex ${fmt_cl(basis?.classes)}`}
>
    {@render children()}
</div>

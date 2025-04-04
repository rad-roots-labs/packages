<script lang="ts">
    import { type IBasisOpt, type IClOpt } from "$root";
    import { fmt_cl } from "@radroots/util";
    import type { Snippet } from "svelte";
    import { fade, type FadeParams } from "svelte/transition";

    let {
        basis = undefined,
        children,
    }: {
        basis?: IBasisOpt<IClOpt> & { in?: FadeParams; out?: FadeParams };
        children: Snippet;
    } = $props();
</script>

<div
    in:fade={basis?.in || { duration: 200 }}
    out:fade={basis?.out || { delay: 50, duration: 200 }}
    class={`${fmt_cl(basis?.classes)} flex`}
>
    {@render children()}
</div>

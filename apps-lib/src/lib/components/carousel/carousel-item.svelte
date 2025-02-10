<script lang="ts">
    import { fmt_cl, type IBasisOpt, type IClOpt } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis = undefined,
        children,
    }: {
        basis?: IBasisOpt<IClOpt>;
        children: Snippet;
    } = $props();
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col flex-shrink-0 w-[100vw] justify-start items-center`}
>
    {@render children()}
</div>

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
    class={`${fmt_cl(basis?.classes)} flex flex-col w-full pt-4 px-4 pb-24 gap-4 justify-center items-center`}
>
    {@render children()}
</div>

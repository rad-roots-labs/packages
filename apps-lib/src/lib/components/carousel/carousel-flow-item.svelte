<script lang="ts">
    import { fmt_cl, type IClOpt } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis?: IClOpt;
        children: Snippet;
    } = $props();
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col flex-shrink-0 h-full w-full justify-start items-start`}
>
    {@render children()}
</div>

<script lang="ts">
    import { type IClOpt } from "$root";
    import { fmt_cl } from "@radroots/util";
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

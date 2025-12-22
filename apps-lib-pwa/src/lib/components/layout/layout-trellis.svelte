<script lang="ts">
    import { type IBasisOpt, type IClOpt, fmt_cl } from "@radroots/apps-lib";
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
    class={`${fmt_cl(
        basis?.classes,
    )} flex flex-col pb-12 gap-6 justify-center items-center scroll-hide`}
>
    {@render children()}
</div>

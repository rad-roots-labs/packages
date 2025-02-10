<script lang="ts">
    import { casl_i } from "$root";
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
    class={`${fmt_cl(basis?.classes)} relative flex flex-col w-full overflow-hidden`}
>
    <div
        class={`flex h-full transition-transform duration-500`}
        style={`transform: translateX(-${Math.max($casl_i, 0) * 100}vw)`}
    >
        {@render children()}
    </div>
</div>

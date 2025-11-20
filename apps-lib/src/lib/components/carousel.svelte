<script lang="ts">
    import { casl_i } from "$lib/stores/carousel";
    import type { IBasisOpt, IClOpt } from "$lib/types/ui";
    import { fmt_cl } from "$lib/utils/app/lib";
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

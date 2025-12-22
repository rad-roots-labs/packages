<script lang="ts">
    import { type IClOpt, fmt_cl } from "@radroots/apps-lib";
    import type { Snippet } from "svelte";

    let {
        basis,
        children,
    }: {
        basis: IClOpt;
        children: Snippet;
    } = $props();
</script>

<div
    class={`${fmt_cl(basis.classes)} relative flex flex-col w-full py-[4px] px-[4px] justify-start items-center rounded-[32px] overflow-hidden bg-white shadow-sm`}
>
    <div
        class={`flex flex-row h-full w-full justify-center items-center bg-white/30 overflow-hidden rounded-[28px]`}
    >
        {@render children()}
    </div>
</div>

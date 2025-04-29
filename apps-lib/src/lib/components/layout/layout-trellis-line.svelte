<script lang="ts">
    import {
        app_lo,
        Glyph,
        type IBasisOpt,
        type ILayoutTrellisLine,
    } from "$root";
    import { fmt_cl } from "@radroots/util";
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    let {
        basis = undefined,
        children,
    }: {
        basis?: IBasisOpt<ILayoutTrellisLine>;
        children: Snippet;
    } = $props();
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col w-lo_line_entry_${$app_lo} gap-[6px] justify-start items-center`}
>
    {#if (basis?.label && `value` in basis?.label) || basis?.notify}
        <div
            class={`flex flex-row h-5 w-full px-2 gap-[6px] justify-start items-center`}
        >
            {#if basis?.label && `value` in basis?.label}
                <p
                    class={`${fmt_cl(basis?.label.classes)} font-sans font-[400] uppercase text-layer-0-glyph text-sm`}
                >
                    {basis?.label.value}
                </p>
            {/if}
            {#if basis?.notify}
                <button
                    in:fade={{ duration: 200 }}
                    out:fade={{ delay: 50, duration: 200 }}
                    onclick={async () => {
                        await basis?.notify?.callback();
                    }}
                    class={`${fmt_cl(basis?.notify.classes)} flex flex-row gap-1 justify-end items-center text-layer-0-glyph/80 el-re`}
                >
                    {#if `glyph` in basis?.notify && basis?.notify?.glyph && basis.notify.glyph_first}
                        <Glyph basis={basis.notify.glyph} />
                    {/if}
                    {#if `label` in basis?.notify && basis?.notify?.label && `value` in basis?.notify?.label}
                        <p
                            class={`${fmt_cl(basis?.notify.label.classes)} font-sans font-[500] uppercase text-xs`}
                        >
                            {basis?.notify.label.value}
                        </p>
                    {/if}
                    {#if `glyph` in basis?.notify && basis?.notify?.glyph && !basis.notify.glyph_first}
                        <Glyph basis={basis.notify.glyph} />
                    {/if}
                </button>
            {/if}
        </div>
    {/if}
    {@render children()}
</div>

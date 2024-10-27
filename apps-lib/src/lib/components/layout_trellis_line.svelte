<script lang="ts">
    import {
        fmt_cl,
        type ICb,
        type IClOpt,
        type IGlOpt,
        type ILabelOpt,
    } from "$lib";
    import Glyph from "$lib/el/glyph.svelte";
    import { fade } from "svelte/transition";

    export let basis:
        | (ILabelOpt &
              IClOpt & {
                  notify?: IClOpt &
                      ICb &
                      ILabelOpt &
                      IGlOpt & {
                          glyph_last?: boolean;
                      };
              })
        | undefined = undefined;
    $: basis = basis;
</script>

<div
    class={`${fmt_cl(basis?.classes)} flex flex-col w-trellis_line gap-[6px] justify-start items-center`}
>
    {#if (basis?.label && `value` in basis?.label) || basis?.notify}
        <div
            class={`flex flex-row h-5 w-full px-2 gap-2 justify-start items-center`}
        >
            {#if `value` in basis?.label}
                <p
                    class={`${fmt_cl(basis?.label.classes)} font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                >
                    {basis?.label.value}
                </p>
            {/if}
            {#if basis?.notify}
                <div
                    in:fade={{ duration: 200 }}
                    out:fade={{ delay: 50, duration: 200 }}
                    class={`${fmt_cl(basis?.notify.classes)} flex flex-row justify-start items-center el-re`}
                >
                    <button
                        class={`flex flex-row justify-center items-center text-layer-2-glyph/80`}
                        on:click={async () => {
                            await basis?.notify?.callback();
                        }}
                    >
                        {#if `glyph` in basis?.notify && basis?.notify?.glyph && !basis.notify.glyph_last}
                            <Glyph basis={basis.notify.glyph} />
                        {/if}
                        {#if `label` in basis?.notify && basis?.notify?.label && `value` in basis?.notify?.label}
                            <p
                                class={`${fmt_cl(basis?.notify.label.classes)} font-sans font-[500] uppercase text-xs`}
                            >
                                {basis?.notify.label.value}
                            </p>
                        {/if}
                        {#if `glyph` in basis?.notify && basis?.notify?.glyph && basis.notify.glyph_last}
                            <Glyph basis={basis.notify.glyph} />
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
    {/if}
    <slot />
</div>

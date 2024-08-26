<script lang="ts">
    import type { ThemeLayer } from "@radroots/theme";
    import {
        fmt_trellis,
        sleep,
        trellis_end,
        trellis_row_display_value,
        trellis_row_label,
        type ITrellisBasisTouch,
    } from "..";

    export let basis: ITrellisBasisTouch;
    export let layer: ThemeLayer;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
    export let hide_active: boolean;
</script>

<div class={`flex flex-row flex-grow overflow-x-hidden`}>
    <div
        class={`${fmt_trellis(hide_border_b, hide_border_t)} flex flex-row h-full w-full justify-center items-center border-t-line border-layer-${layer}-surface-edge transition-all`}
    >
        <button
            class={`relative group flex flex-row h-line w-full pr-[2px] justify-between items-center transition-all`}
            on:click={async (ev) => {
                await sleep(100);
                if (basis.callback) await basis.callback(ev);
            }}
        >
            <div
                class={`flex flex-row h-full w-full justify-between items-center`}
            >
                <svelte:component
                    this={trellis_row_label}
                    basis={basis.label}
                    {layer}
                    {hide_active}
                />
                {#if basis.display}
                    <svelte:component
                        this={trellis_row_display_value}
                        basis={{
                            ...basis.display,
                            callback: async (ev) => {
                                //@todo
                            },
                        }}
                        {layer}
                        {hide_active}
                        end_offset={!!basis.end}
                    />
                {/if}
            </div>
            {#if basis.end}
                <svelte:component
                    this={trellis_end}
                    basis={basis.end}
                    {layer}
                    {hide_active}
                />
            {/if}
        </button>
    </div>
</div>

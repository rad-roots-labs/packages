<script lang="ts">
    import {
        fmt_trellis,
        sleep,
        TrellisEnd,
        TrellisRowDisplayValue,
        TrellisRowLabel,
        type ITrellisBasisTouch,
    } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: ITrellisBasisTouch;
    export let layer: ThemeLayer;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
    export let hide_active: boolean;
</script>

<div class={`flex flex-row flex-grow overflow-x-hidden`}>
    <div
        class={`${fmt_trellis(hide_border_b, hide_border_t)} flex flex-row h-full w-full justify-center items-center border-t-line border-layer-${layer}-surface-edge el-re`}
    >
        <button
            class={`relative group flex flex-row h-line w-full pr-[2px] justify-between items-center el-re`}
            on:click={async (ev) => {
                await sleep(100);
                if (basis.callback) await basis.callback(ev);
            }}
        >
            <div
                class={`flex flex-row h-full justify-between items-center ${basis.end ? `pr-2` : ``}`}
            >
                <TrellisRowLabel basis={basis.label} {layer} {hide_active} />
                {#if basis.display}
                    <TrellisRowDisplayValue
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
                <TrellisEnd basis={basis.end} {layer} {hide_active} />
            {/if}
        </button>
    </div>
</div>

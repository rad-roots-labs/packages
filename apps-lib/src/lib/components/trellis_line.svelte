<script lang="ts">
    import { fmt_trellis, type CallbackPromiseGeneric } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let layer: ThemeLayer;
    export let callback: CallbackPromiseGeneric<MouseEvent>;
    export let hide_border_t: boolean;
    export let hide_border_b: boolean;
</script>

<button
    class={`flex flex-row flex-grow overflow-x-hidden`}
    on:click={async (ev) => {
        if (callback) await callback(ev);
    }}
>
    <div
        class={`${fmt_trellis(hide_border_b, hide_border_t)} flex flex-row h-full w-full justify-center items-center border-t-line border-layer-${layer}-surface-edge el-re`}
    >
        <div
            class={`relative group flex flex-row h-line w-full pr-[2px] justify-between items-center el-re`}
        >
            <div
                class={`flex flex-row h-full w-trellis_display justify-between items-center`}
            >
                <slot />
            </div>
            <slot name="end" />
        </div>
    </div>
</button>

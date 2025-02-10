<script lang="ts">
    import { LoadSymbol } from "$root";
    import type { ThemeLayer } from "@radroots/theme";
    import { fmt_trellis, type CallbackPromiseGeneric } from "@radroots/util";
    import type { Snippet } from "svelte";

    let {
        loading = false,
        layer,
        callback,
        hide_border_b,
        hide_border_t,
        children,
        el_end,
    }: {
        loading?: boolean;
        layer: ThemeLayer;
        callback?: CallbackPromiseGeneric<MouseEvent>;
        hide_border_b: boolean;
        hide_border_t: boolean;
        children: Snippet;
        el_end?: Snippet;
    } = $props();
</script>

<button
    class={`flex flex-row flex-grow overflow-hidden`}
    onclick={async (ev) => {
        if (callback) await callback(ev);
    }}
>
    <div
        class={`${fmt_trellis(hide_border_b, hide_border_t)} flex flex-row h-full w-full justify-center items-center border-t-line border-layer-${layer}-surface-edge el-re`}
    >
        {#if loading}
            <div
                class={`flex flex-row h-full w-full justify-center items-center`}
            >
                <LoadSymbol basis={{ dim: `sm` }} />
            </div>
        {:else}
            <div
                class={`relative group flex flex-row h-line w-full pr-[2px] justify-between items-center el-re`}
            >
                <div
                    class={`flex flex-row h-full w-trellis_display justify-between items-center`}
                >
                    {@render children()}
                </div>
                {#if el_end}
                    {@render el_end()}
                {/if}
            </div>
        {/if}
    </div>
</button>

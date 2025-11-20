<script lang="ts">
    import { app_lo } from "$lib/stores/app";
    import {
        type IClOpt,
        type IDisabledOpt,
        type ILoadingOpt,
        type ILyOpt,
        fmt_cl,
        parse_layer,
    } from "@radroots/apps-lib";
    import type { CallbackPromise } from "@radroots/utils";
    import LoadSymbol from "../lib/load-symbol.svelte";

    let {
        basis,
    }: {
        basis: ILyOpt &
            IClOpt &
            IDisabledOpt &
            ILoadingOpt & {
                classes_inner?: string;
                hide_active?: boolean;
                label: string;
                callback: CallbackPromise;
            };
    } = $props();

    const layer = $derived(parse_layer(basis.layer, 1));

    const classes_active = $derived(
        !basis.hide_active
            ? `ly1-active-surface ly1-active-raise-less ly1-active-ring-less`
            : ``,
    );
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row h-touch_guide w-lo_${$app_lo} justify-center items-center bg-ly${layer} rounded-touch ${basis.disabled ? `opacity-60` : classes_active} el-re`}
    onclick={async (ev) => {
        ev.stopPropagation();
        if (!basis.disabled) await basis.callback();
    }}
>
    {#if basis.loading}
        <LoadSymbol basis={{ dim: `md` }} />
    {:else}
        <p
            class={`${fmt_cl(basis.classes_inner)} font-sans font-[600] tracking-wide text-ly${layer}-gl-shade ${basis.disabled ? `` : `group-active:text-ly${layer}-gl/40 `} el-re`}
        >
            {basis.label || ``}
        </p>
    {/if}
</button>

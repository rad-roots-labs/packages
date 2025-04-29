<script lang="ts">
    import {
        app_lo,
        LoadSymbol,
        type IClOpt,
        type IDisabledOpt,
        type ILoadingOpt,
        type ILyOpt,
    } from "$root";
    import { fmt_cl, parse_layer, type CallbackPromise } from "@radroots/util";

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
            ? `layer-1-active-surface layer-1-active-raise-less layer-1-active-ring-less`
            : ``,
    );
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row h-touch_guide w-lo_${$app_lo} justify-center items-center bg-layer-${layer}-surface rounded-touch ${basis.disabled ? `opacity-60` : classes_active} el-re`}
    onclick={async (ev) => {
        ev.stopPropagation();
        if (!basis.disabled) await basis.callback();
    }}
>
    {#if basis.loading}
        <LoadSymbol basis={{ dim: `md` }} />
    {:else}
        <p
            class={`${fmt_cl(basis.classes_inner)} font-sans font-[600] tracking-wide text-layer-${layer}-glyph-shade ${basis.disabled ? `` : `group-active:text-layer-${layer}-glyph/40 `} el-re`}
        >
            {basis.label || ``}
        </p>
    {/if}
</button>

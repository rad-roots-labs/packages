<script lang="ts">
    import {
        app_layout,
        fmt_cl,
        parse_layer,
        type CallbackPromise,
        type IClOpt,
        type IDisabledOpt,
        type ILyOpt,
    } from "$lib";

    export let basis: ILyOpt &
        IClOpt &
        IDisabledOpt & {
            classes_inner?: string;
            hide_active?: boolean;
            label: string;
            callback: CallbackPromise;
        };

    $: layer = parse_layer(basis.layer, 1);

    $: classes_active = !basis.hide_active
        ? `layer-1-active-surface layer-1-active-raise-less layer-1-active-ring-less`
        : ``;
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row h-touch_guide w-${$app_layout} justify-center items-center bg-layer-${layer}-surface rounded-touch ${basis.disabled ? `opacity-60` : classes_active} el-re`}
    on:click|stopPropagation={async () => {
        if (!basis.disabled) await basis.callback();
    }}
>
    <p
        class={`${fmt_cl(basis.classes_inner)} font-sans font-[600] tracking-wide text-layer-${layer}-glyph-shade ${basis.disabled ? `` : `group-active:text-layer-${layer}-glyph/40 `} el-re`}
    >
        {basis.label}
    </p>
</button>

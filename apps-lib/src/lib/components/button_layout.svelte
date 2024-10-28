<script lang="ts">
    import {
        app_layout,
        parse_layer,
        type CallbackPromise,
        type ILyOpt,
    } from "$lib";

    export let basis: ILyOpt & {
        disabled?: boolean;
        label: string;
        callback: CallbackPromise;
    };

    $: layer = parse_layer(basis.layer, 1);
</script>

<button
    class={`group flex flex-row h-touch_guide w-${$app_layout} justify-center items-center bg-layer-${layer}-surface round-44 ${basis.disabled ? `opacity-60` : `touch-layer-${layer}`} transition-all`}
    on:click|stopPropagation={async () => {
        if (!basis.disabled) await basis.callback();
    }}
>
    <p
        class={`font-sans font-[600] tracking-wide text-layer-${layer}-glyph_d ${basis.disabled ? `` : `group-active:text-layer-${layer}-glyph/40 `}transition-all`}
    >
        {basis.label}
    </p>
</button>

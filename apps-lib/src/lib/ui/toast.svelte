<script lang="ts">
    import {
        app_layout,
        fmt_cl,
        get_layout,
        parse_layer,
        toast_layout_map,
        toast_style_map,
        type IToast,
        type IToastKind,
    } from "$lib";
    import Glyph from "./glyph.svelte";

    export let basis: IToast;
    $: basis = basis;

    let styles: IToastKind[] = basis.styles || [`simple`];
    $: styles = styles;
    $: layer = basis.layer ? parse_layer(basis.layer) : 1;
    $: layout = get_layout($app_layout);
</script>

<div
    class={`${fmt_cl(toast_layout_map.get(layout))} z-[1000] h-[100vh] toast w-full ${basis.position || `top-center`} `}
>
    <div class={`flex flex-row w-full h-max justify-center pb-2`}>
        <div
            class={`${fmt_cl(basis.classes)} relative grid grid-cols-12 h-max items-center justify-center ${styles.includes(`simple`) ? `bg-layer-${layer}-surface` : ``} ${fmt_cl(styles.map((style) => fmt_cl(toast_style_map.get(style)?.outer)).join(` `))}`}
        >
            <div
                class={`absolute top-0 left-4 flex flex-row h-full items-center text-layer-${layer}-glyph`}
            >
                <Glyph
                    basis={{
                        key: `info`,
                        weight: `regular`,
                        dim: `md`,
                        ...basis.glyph,
                    }}
                />
            </div>
            <div
                class={`col-span-12 flex flex-row pl-1 ${fmt_cl(styles.map((style) => fmt_cl(toast_style_map.get(style)?.inner)).join(` `))}`}
            >
                {#if `value` in basis.label}
                    <p
                        class={`font-sans font-[500] truncate text-layer-${layer}-glyph -translate-y-[1px]`}
                    >
                        {basis.label.value}
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>

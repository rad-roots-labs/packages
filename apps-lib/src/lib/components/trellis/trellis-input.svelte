<script lang="ts">
    import { Glyph, Input, LoadSymbol, type ITrellisBasisInput } from "$root";
    import type { ThemeLayer } from "@radroots/theme";
    import { fmt_cl, fmt_trellis } from "@radroots/util";

    let {
        basis,
        layer,
        hide_border_b,
        hide_border_t,
    }: {
        basis: ITrellisBasisInput;
        layer: ThemeLayer;
        hide_border_b: boolean;
        hide_border_t: boolean;
    } = $props();
</script>

<div class={`flex flex-row flex-grow h-full w-full`}>
    <div
        class={`${fmt_trellis(hide_border_b, hide_border_t)} flex flex-row h-line w-full justify-start items-center border-t-line border-layer-${layer}-surface-edge overflow-hidden`}
    >
        {#if basis.line_label && basis.line_label.value}
            <div
                class={`${fmt_cl(basis.line_label.classes)} flex flex-row h-full justify-start items-center overflow-x-hidden`}
            >
                <p class={`font-sans text-layer-${layer}-glyph_b`}>
                    {basis.line_label.value}
                </p>
            </div>
        {/if}
        <div
            class={`relative flex flex-row flex-grow h-full pr-12 justify-start items-center`}
        >
            <Input
                basis={{
                    ...basis.basis,
                    layer: layer,
                }}
            />
            {#if basis.action}
                {#if basis.action.visible}
                    <div
                        class={`absolute top-0 right-0 flex flex-row h-full w-12 pr-4 justify-end items-center fade-in`}
                    >
                        {#if basis.action.loading}
                            <div class={`flex flex-row fade-in`}>
                                <LoadSymbol
                                    basis={{
                                        dim: `glyph-send-button`,
                                        blades: 8,
                                        classes: `text-layer-${layer}-glyph el-re`,
                                    }}
                                />
                            </div>
                        {:else}
                            <button
                                class={`group fade-in-long`}
                                onclick={async () => {
                                    if (basis.action?.callback)
                                        await basis.action.callback();
                                }}
                            >
                                <Glyph
                                    basis={basis.action.glyph
                                        ? {
                                              dim: `md-`,
                                              ...basis.action.glyph,
                                          }
                                        : {
                                              key: `plus`,
                                              classes: `text-layer-${layer}-glyph`,
                                              dim: `md-`,
                                          }}
                                />
                            </button>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

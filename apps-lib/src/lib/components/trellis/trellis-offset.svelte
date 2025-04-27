<script lang="ts">
    import {
        Empty,
        Glyph,
        GlyphCircle,
        LoadSymbol,
        type ITrellisBasisOffset,
        type ITrellisBasisOffsetMod,
    } from "$root";
    import type { ThemeLayer } from "@radroots/theme";
    import { fmt_cl } from "@radroots/util";

    let {
        basis = undefined,
        layer,
    }: {
        basis?: ITrellisBasisOffset;
        layer: ThemeLayer;
    } = $props();

    const mod: ITrellisBasisOffsetMod = $derived(basis?.mod ? basis.mod : `sm`);
</script>

<div class={`flex flex-row h-full`}>
    {#if mod === `sm`}
        <div class={`${fmt_cl(``)} flex flex-row h-full w-[22px]`}>
            <Empty />
        </div>
    {:else if mod === `glyph`}
        <div class={`flex flex-row pr-[2px]`}>
            <div class={`${fmt_cl(``)} flex flex-row h-full w-trellisOffset`}>
                <Empty />
            </div>
        </div>
    {:else if typeof mod === `object`}
        <div
            class={`flex flex-row h-full min-w-[20px] w-trellisOffset justify-center items-center pr-3`}
        >
            <button
                class={`fade-in pl-2 translate-x-[3px] translate-y-[1px]`}
                onclick={async (ev) => {
                    if (mod.loading) return;
                    else if (typeof basis !== `boolean` && basis?.callback)
                        await basis.callback(ev);
                }}
            >
                {#if mod.loading}
                    <LoadSymbol basis={{ blades: 8, dim: `xs` }} />
                {:else if `glyph` in mod}
                    <Glyph
                        basis={{
                            classes: mod.glyph.classes
                                ? mod.glyph.classes
                                : `text-layer-${layer}-glyph`,
                            ...mod.glyph,
                        }}
                    />
                {:else if `glyph_circle` in mod}
                    <GlyphCircle
                        basis={{
                            classes_wrap: mod.glyph_circle?.classes_wrap,
                            glyph: {
                                classes: mod.glyph_circle?.glyph?.classes
                                    ? mod.glyph_circle?.glyph?.classes
                                    : `text-layer-${layer}-glyph`,
                                ...mod.glyph_circle?.glyph,
                            },
                        }}
                    />
                {/if}
            </button>
        </div>
    {/if}
</div>

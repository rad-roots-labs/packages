<script lang="ts">
    import GlyphCircle from "$lib/ui/glyph_circle.svelte";
    import Loading from "$lib/ui/loading.svelte";
    import type { ThemeLayer } from "@radroots/theme";
    import {
        Fill,
        fmt_cl,
        Glyph,
        type ITrellisBasisOffset,
        type ITrellisBasisOffsetMod,
    } from "..";

    export let basis: ITrellisBasisOffset | undefined = undefined;
    export let layer: ThemeLayer;

    let mod: ITrellisBasisOffsetMod = `sm`;
    $: mod = basis && basis.mod ? basis.mod : `sm`;
</script>

<div class={`flex flex-row h-full`}>
    {#if mod === `sm`}
        <div class={`${fmt_cl(``)} flex flex-row h-full w-[22px]`}>
            <Fill />
        </div>
    {:else if mod === `glyph`}
        <div class={`flex flex-row pr-[2px]`}>
            <div class={`${fmt_cl(``)} flex flex-row h-full w-trellisOffset`}>
                <Fill />
            </div>
        </div>
    {:else if typeof mod === `object`}
        <div
            class={`flex flex-row h-full min-w-[20px] w-trellisOffset justify-center items-center pr-2`}
        >
            <button
                class={`fade-in pl-2 translate-x-[3px] translate-y-[1px]`}
                on:click|preventDefault={async (ev) => {
                    if (mod.loading) return;
                    else if (typeof basis !== `boolean` && basis?.callback)
                        await basis.callback(ev);
                }}
            >
                {#if mod.loading}
                    <Loading basis={{ blades: 6, dim: `xs` }} />
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

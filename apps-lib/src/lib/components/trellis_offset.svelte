<script lang="ts">
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
    //min-w-[34px]
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
            class={`flex flex-row h-full min-w-[20px] w-trellisOffset justify-center items-center`}
        >
            <button
                class={`fade-in pl-2 translate-x-[3px] translate-y-[1px]`}
                on:click|preventDefault={async (ev) => {
                    if (typeof basis !== `boolean` && basis?.callback)
                        await basis.callback(ev);
                }}
            >
                <Glyph
                    basis={{
                        classes: `text-layer-${layer}-glyph ${fmt_cl(mod.classes ? `` : ``)}`,
                        ...mod,
                    }}
                />
            </button>
        </div>
    {/if}
</div>

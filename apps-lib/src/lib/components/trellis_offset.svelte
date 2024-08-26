<script lang="ts">
    import {
        fill,
        fmt_cl,
        glyph,
        type ITrellisBasisOffset,
        type ITrellisBasisOffsetMod,
    } from "..";

    export let basis: ITrellisBasisOffset | undefined;

    let mod: ITrellisBasisOffsetMod = `sm`;
    $: mod = basis && basis.mod ? basis.mod : `sm`;
</script>

{#if mod !== `none`}
    <div class={`flex flex-row h-full`}>
        {#if mod === `sm`}
            <div class={`${fmt_cl(``)} flex flex-row h-full w-[22px]`}>
                <svelte:component this={fill} />
            </div>
        {:else if mod === `glyph`}
            <div class={`flex flex-row pr-[2px]`}>
                <div
                    class={`${fmt_cl(``)} flex flex-row h-full w-trellisOffset`}
                >
                    <svelte:component this={fill} />
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
                    <svelte:component
                        this={glyph}
                        basis={{
                            ...mod,
                        }}
                    />
                </button>
            </div>
        {/if}
    </div>
{/if}

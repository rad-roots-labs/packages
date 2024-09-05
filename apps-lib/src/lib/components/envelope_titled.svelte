<script lang="ts">
    import {
        type CallbackPromise,
        fmt_cl,
        type IEnvelopeTitledBasis,
        t,
    } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: IEnvelopeTitledBasis;
    export let layer: ThemeLayer;
    export let callback_close: CallbackPromise;

    $: classes_action = basis.callback_valid
        ? `text-layer-${layer}-glyph-hl group-active:opacity-60`
        : `text-layer-${layer}-glyph-shade opacity-40`;
    $: classes_title =
        basis.hide_border === true || typeof basis.hide_border !== `boolean`
            ? ``
            : `border-b-line border-layer-${layer}-surface-edge`;
</script>

<div class={`flex flex-col h-[700px] w-full bg-layer-1-surface rounded-t-xl`}>
    <div class={`${classes_title} grid grid-cols-12 h-envTop w-full px-4`}>
        <div
            class={`col-span-3 flex flex-row h-full justify-start items-center`}
        >
            <button
                class={`group`}
                on:click|preventDefault={async () => await callback_close()}
            >
                <p
                    class={`glyph font-sans text-envelopeTitlePrevious text-layer-${layer}-glyph-hl group-active:opacity-40 transition-all`}
                >
                    {basis.previous || `${$t(`common.cancel`)}`}
                </p>
            </button>
        </div>
        <div
            class={`col-span-6 flex flex-row h-full justify-center items-center`}
        >
            {#if basis.title}
                <p
                    class={`${fmt_cl(basis.title.classes)} glyph font-sans text-envelopeTitle`}
                >
                    {basis.title.value}
                </p>
            {/if}
        </div>
        <div class={`col-span-3 flex flex-row h-full justify-end items-center`}>
            <button
                class={`group`}
                on:click|preventDefault={async () => {
                    if (basis.callback_valid) await basis.callback();
                }}
            >
                <p
                    class={`glyph font-sans text-envelopeTitleAction ${classes_action} transition-all`}
                >
                    {basis.action || `${$t(`common.add`)}`}
                </p>
            </button>
        </div>
    </div>
    <div class={`flex flex-col w-full overflow-y-scroll`}>
        <slot />
    </div>
</div>

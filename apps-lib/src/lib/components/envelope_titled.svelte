<script lang="ts">
    import {
        type CallbackPromise,
        fmt_cl,
        Glyph,
        type IEnvelopeTitledBasis,
        t,
    } from "$lib";
    import Fill from "$lib/ui/fill.svelte";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: IEnvelopeTitledBasis;
    export let layer: ThemeLayer;
    export let callback_close: CallbackPromise;

    $: classes_base =
        basis.hide_border === true || typeof basis.hide_border !== `boolean`
            ? ``
            : `border-b-line border-layer-${layer}-surface-edge`;
    $: classes_submit =
        typeof basis.submit?.valid === `boolean` && !basis.submit?.valid
            ? `text-layer-${layer}-glyph-shade opacity-40`
            : `text-layer-${layer}-glyph-hl group-active:opacity-60`;
</script>

<div
    class={`flex flex-col h-[700px] w-full bg-layer-${layer + 1}-surface rounded-t-3xl`}
>
    <div class={`${classes_base} grid grid-cols-12 h-envTop w-full px-4`}>
        <div
            class={`col-span-3 flex flex-row h-full justify-start items-center`}
        >
            <button
                class={`group`}
                on:click|preventDefault={async () => await callback_close()}
            >
                <p
                    class={`${fmt_cl(basis.previous?.label?.classes)} font-sans text-envelopeTitlePrevious text-layer-${layer}-glyph-hl group-active:opacity-40 transition-all`}
                >
                    {basis.previous?.label?.value || `${$t(`common.cancel`)}`}
                </p>
            </button>
        </div>
        <div
            class={`col-span-6 flex flex-row h-full justify-center items-center`}
        >
            {#if basis.heading?.label?.value}
                <p
                    class={`${fmt_cl(basis.heading?.label?.classes)} font-sans text-envelopeTitle text-layer-${layer + 1}-glyph`}
                >
                    {basis.heading?.label?.value || ``}
                </p>
            {:else}
                <Fill />
            {/if}
        </div>
        <div class={`col-span-3 flex flex-row h-full justify-end items-center`}>
            {#if basis.submit}
                <button
                    class={`group`}
                    on:click|preventDefault={async () => {
                        if (
                            typeof basis.submit?.valid === `boolean` &&
                            !basis.submit?.valid
                        )
                            return;
                        await basis.submit?.callback();
                    }}
                >
                    {#if `glyph` in basis.submit}
                        <Glyph basis={basis.submit?.glyph} />
                    {:else if `label` in basis.submit}
                        <p
                            class={`font-sans text-envelopeTitleAction ${classes_submit} transition-all`}
                        >
                            {basis.submit?.label.value || `${$t(`common.add`)}`}
                        </p>
                    {:else}
                        <Fill />
                    {/if}
                </button>
            {:else}
                <Fill />
            {/if}
        </div>
    </div>
    <div class={`flex flex-col w-full overflow-y-scroll`}>
        <slot />
    </div>
</div>

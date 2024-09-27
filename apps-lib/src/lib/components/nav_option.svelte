<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        LabelSwap,
        Loading,
        type INavBasisOption,
    } from "$lib";

    export let basis: INavBasisOption;
    $: basis = basis;
</script>

{#if basis.loading}
    <div class={`flex flex-row pr-4 justify-center items-center`}>
        <Loading />
    </div>
{:else}
    <button
        class={`group col-span-4 flex flex-row h-full pr-6 gap-2 justify-end items-center`}
        on:click={async () => {
            //await basis.callback([classes_swap ? false : true, el_swap]);
            //if (classes_swap) classes_swap = ``;
            //else classes_swap = ` swap-active`;
        }}
    >
        {#if `glyph` in basis && basis.glyph}
            <Glyph
                basis={{
                    classes: `group-active:opacity-70  ${basis.glyph.classes}`,
                    ...basis.glyph,
                }}
            />
        {/if}
        {#if `label` in basis && basis.label}
            {#if `swap` in basis.label}
                <LabelSwap basis={basis.label} />
            {:else if `value` in basis.label}
                <p
                    class={`${fmt_cl(basis.label.classes)} font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                >
                    {basis.label.value}
                </p>
            {/if}
        {/if}
    </button>
{/if}

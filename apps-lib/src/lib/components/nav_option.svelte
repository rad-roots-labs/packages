<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        Loading,
        parse_layer,
        type INavBasisOption,
    } from "$lib";

    let el_swap: HTMLLabelElement | null = null;

    export let basis: INavBasisOption;
    $: basis = basis;

    $: layer = parse_layer(1);
</script>

{#if basis.loading}
    <div class={`flex flex-row pr-4 justify-center items-center`}>
        <Loading />
    </div>
{:else}
    <button
        class={`${fmt_cl(basis.classes)} group col-span-4 flex flex-row h-full pr-6 justify-end items-center`}
        on:click={async () => {
            await basis.callback(el_swap);
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
                <label
                    bind:this={el_swap}
                    class={`swap${basis.label.swap.toggle ? ` swap-active` : ``}`}
                >
                    <div class="swap-on">
                        <p
                            class={`${fmt_cl(basis.label.swap.on.classes || `text-navPrevious text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] transition-all`}
                        >
                            {basis.label.swap.on.value}
                        </p>
                    </div>
                    <div class="swap-off">
                        <p
                            class={`${fmt_cl(basis.label.swap.off.classes || `text-navPrevious text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] transition-all`}
                        >
                            {basis.label.swap.off.value}
                        </p>
                    </div>
                </label>
            {:else if `value` in basis.label}
                <p
                    class={`${fmt_cl(basis.label.classes)} font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                >
                    {basis.label.value}
                </p>
            {/if}
            {#if `glyph` in basis.label && basis.label.glyph}
                <Glyph
                    basis={{
                        key: basis.label.glyph.key,
                        classes: `text-layer-1-glyph-hl group-active:opacity-60 ${basis.label.glyph.classes}`,
                        weight: `bold`,
                        dim: `md`,
                    }}
                />
            {/if}
        {/if}
    </button>
{/if}

<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
    import { fmt_cl, type ILabelSwap, type ILyOpt } from "$lib";

    export let el_swap: HTMLLabelElement | null = null;
    export let basis: ILabelSwap & ILyOpt;
    $: basis = basis;

    $: layer = basis?.layer ? basis.layer : 1;
    $: classes_swap = basis.swap?.toggle ? ` swap-active` : ``;
</script>

<div class={`flex flex-row justify-start items-center`}>
    <label bind:this={el_swap} class={`swap${classes_swap}`}>
        <div class="swap-on">
            <p
                class={`${fmt_cl(basis.swap.on.classes || `text-navPrevious text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] transition-all`}
            >
                {basis.swap.on.value}
            </p>
        </div>
        <div class="swap-off">
            <p
                class={`${fmt_cl(basis.swap.off.classes || `text-navPrevious text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] transition-all`}
            >
                {basis.swap.off.value}
            </p>
        </div>
    </label>
</div>

<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
    import { fmt_cl, type IClOpt, type ILabelSwap, type ILyOpt } from "$lib";

    export let el_swap: HTMLLabelElement | null = null;
    export let basis: IClOpt & ILabelSwap & ILyOpt & {};
    $: basis = basis;

    $: layer = basis?.layer ? basis.layer : 1;
    $: classes_swap = basis.swap?.on ? ` swap-active` : ``;
</script>

<label bind:this={el_swap} class={`swap${classes_swap}`}>
    <div class="swap-off">
        <p
            class={`${fmt_cl(basis.classes)} font-sans text-navPrevious text-layer-${layer}-glyph-hl -translate-y-[1px] transition-all`}
        >
            {basis.swap.value_off}
        </p>
    </div>
    <div class="swap-on">
        <p
            class={`${fmt_cl(basis.classes)} font-sans text-navPrevious text-layer-${layer}-glyph-hl group-active:opacity-60 -translate-y-[1px] transition-all`}
        >
            {basis.swap.value_on}
        </p>
    </div>
</label>

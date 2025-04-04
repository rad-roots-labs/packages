<script lang="ts">
    import { type ILabelSwap, type ILyOpt } from "$root";
    import { fmt_cl, parse_layer } from "@radroots/util";

    let {
        basis,
        el = $bindable(null),
    }: {
        basis: ILabelSwap & ILyOpt;
        el?: HTMLLabelElement | null;
    } = $props();

    const layer = $derived(parse_layer(basis?.layer ? basis.layer : 1));
</script>

<div class={`flex flex-row justify-start items-center`}>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label
        bind:this={el}
        class={`swap${basis.swap.toggle ? ` swap-active` : ``}`}
    >
        <div class="swap-on">
            <p
                class={`${fmt_cl(basis.swap.on.classes || `text-nav_prev text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] el-re`}
            >
                {basis.swap.on.value}
            </p>
        </div>
        <div class="swap-off">
            <p
                class={`${fmt_cl(basis.swap.off.classes || `text-nav_prev text-layer-${layer}-glyph-hl group-active:opacity-60`)} font-sans -translate-y-[1px] el-re`}
            >
                {basis.swap.off.value}
            </p>
        </div>
    </label>
</div>

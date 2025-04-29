<script lang="ts">
    import { type IButtonSimple } from "$root";
    import { parse_layer } from "@radroots/util";

    let { basis }: { basis: IButtonSimple } = $props();

    const layer = $derived(parse_layer(basis.layer || 1));
</script>

<button
    class={`group flex flex-row h-line_button w-full justify-center items-center rounded-touch bg-layer-${layer}-surface layer-${layer}-active-surface layer-${layer}-active-ring`}
    onclick={async (ev) => {
        if (!basis.allow_propogation) ev.stopPropagation();
        await basis.callback();
    }}
>
    <p
        class={`font-sans font-[600] text-xl text-layer-0-glyph capitalize tracking-wider opacity-active`}
    >
        {basis.label}
    </p>
</button>

<script lang="ts">
    import { type ILyOpt } from "$root";
    import { parse_layer, type CallbackPromise } from "@radroots/util";

    let {
        basis,
    }: {
        basis: ILyOpt & {
            label: string;
            callback: CallbackPromise;
            allow_propogation?: boolean;
        };
    } = $props();

    const layer = $derived(parse_layer(basis?.layer ? basis.layer : 1));
</script>

<button
    class={`group flex flex-row h-[3.5rem] w-full justify-center items-center rounded-touch`}
    onclick={async (ev) => {
        if (!basis.allow_propogation) ev.stopPropagation();
        await basis.callback();
    }}
>
    <p
        class={`font-sans font-[700] text-xl text-layer-${layer}-glyph capitalize tracking-wider opacity-active`}
    >
        {basis.label}
    </p>
</button>

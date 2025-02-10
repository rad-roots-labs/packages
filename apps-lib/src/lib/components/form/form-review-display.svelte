<script lang="ts">
    import { Glyph } from "$root";
    import {
        fmt_cl,
        type CallbackPromise,
        type IClOpt,
        type IClOptWrap,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IClOpt &
            IClOptWrap & {
                label: string;
                value: string;
                value_pl?: string;
                handle_back: CallbackPromise;
            };
    } = $props();
</script>

<div
    class={`${fmt_cl(basis.classes_wr)} flex flex-row h-6 w-full justify-between items-start`}
>
    <p
        class={`font-sans font-[500] text-layer-1-glyph_d tracking-tight capitalize`}
    >
        {basis.label}
    </p>
    <button
        class={`flex flex-row max-w-[210px] gap-1 justify-end items-start`}
        onclick={async () => {}}
    >
        <p
            class={`${fmt_cl(basis.classes)} font-sans font-[400] text-[1.05rem] text-justify truncate text-layer-1-glyph_d`}
        >
            {basis.value || basis.value_pl || ``}
        </p>
        <Glyph
            basis={{
                classes: `text-layer-0-glyph pt-1`,
                dim: `xs`,
                key: `caret-right`,
            }}
        />
    </button>
</div>

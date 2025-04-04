<script lang="ts">
    import { Glyph, type IClOpt } from "$root";
    import {
        fmt_cl,
        type CallbackPromise,
        type GlyphKey,
    } from "@radroots/util";

    let {
        basis,
    }: {
        basis: IClOpt & {
            kind?: `primary` | `neutral`;
            label: string;
            callback: CallbackPromise;
            glyph?: GlyphKey;
        };
    } = $props();

    const classes_kind = $derived(
        basis.kind === `neutral`
            ? `text-layer-0-glyph-shade`
            : `text-layer-0-glyph-hl`,
    );
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row justify-center items-center`}
    onclick={basis.callback}
>
    {#if basis.glyph}
        <Glyph
            basis={{
                classes: `${classes_kind}`,
                dim: `sm+`,

                key: basis.glyph,
            }}
        />
    {/if}
    <p
        class={`font-sans font-[600] text-line_label ${classes_kind} opacity-active`}
    >
        {basis.label}
    </p>
</button>

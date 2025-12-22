<script lang="ts">
    import {
        type GlyphKey,
        type IClOpt,
        fmt_cl,
        Glyph,
    } from "@radroots/apps-lib";
    import { type CallbackPromise } from "@radroots/utils";

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
        basis.kind === `neutral` ? `text-ly0-gl-shade` : `text-ly0-gl-hl`,
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

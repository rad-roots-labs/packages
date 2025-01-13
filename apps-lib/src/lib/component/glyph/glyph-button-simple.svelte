<script lang="ts">
    import {
        fmt_cl,
        Glyph,
        type CallbackPromise,
        type GlyphKey,
        type IClOpt,
    } from "$lib";

    export let basis: IClOpt & {
        kind?: `primary` | `neutral`;
        label: string;
        callback: CallbackPromise;
        glyph?: GlyphKey;
    };

    $: classes_kind =
        basis.kind === `neutral`
            ? `text-layer-0-glyph-shade`
            : `text-layer-0-glyph-hl`;
</script>

<button
    class={`${fmt_cl(basis.classes)} group flex flex-row justify-center items-center`}
    on:click={basis.callback}
>
    {#if basis.glyph}
        <Glyph
            basis={{
                classes: `${classes_kind}`,
                dim: `sm+`,
                weight: `bold`,
                key: basis.glyph,
            }}
        />
    {/if}
    <p class={`font-sans font-[600] text-guide ${classes_kind} opacity-active`}>
        {basis.label}
    </p>
</button>

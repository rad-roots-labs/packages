<script lang="ts">
    import { fmt_cl, Glyph, type ITrellisKindDisplayValue } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";

    export let basis: ITrellisKindDisplayValue;
    export let layer: ThemeLayer;
    export let hide_active: boolean;
</script>

<button
    class={`z-10 flex flex-grow justify-end`}
    on:click|stopPropagation={async (ev) => {
        if (basis.callback) await basis.callback(ev);
    }}
>
    {#if `icon` in basis}
        <Glyph
            basis={{
                classes:
                    basis.icon.classes ||
                    `text-layer-${layer}-glyph-shade ${hide_active ? `` : `group-active:text-layer-${layer}-glyph_a`}`,
                key: basis.icon.key,
                weight: `bold`,
                dim: `sm`,
            }}
        />
    {:else if basis.label}
        {#if `value` in basis.label}
            <p
                class={`${fmt_cl(basis.label.classes)} font-sans text-line_display_e line-clamp-1 text-layer-0-glyph-label el-re`}
            >
                {basis.label.value}
            </p>
        {/if}
    {/if}
</button>

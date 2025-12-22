<script lang="ts">
    import type { ITrellisKindDisplayValue } from "$lib/types/components/trellis";
    import { get_label_classes_kind } from "$lib/utils/app";
    import { Glyph, fmt_cl } from "@radroots/apps-lib";
    import type { ThemeLayer } from "@radroots/themes";

    let {
        basis,
        layer,
        hide_active,
    }: {
        basis: ITrellisKindDisplayValue;
        layer: ThemeLayer;
        hide_active: boolean;
    } = $props();
</script>

<button
    class={`z-10 flex flex-grow justify-end`}
    onclick={async (ev) => {
        ev.stopPropagation();
        if (basis.callback) await basis.callback(ev);
    }}
>
    {#if `icon` in basis}
        <Glyph
            basis={{
                classes:
                    basis.icon.classes ||
                    `${get_label_classes_kind(layer, `shade`, hide_active)}`,
                key: basis.icon.key,
                dim: `sm`,
            }}
        />
    {:else if basis.label}
        {#if `value` in basis.label}
            <p
                class={`${fmt_cl(
                    basis.label.classes,
                )} font-sans text-line_d_e line-clamp-1 text-ly0-gl-label el-re`}
            >
                {basis.label.value}
            </p>
        {/if}
    {/if}
</button>

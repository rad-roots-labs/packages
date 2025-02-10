<script lang="ts">
    import type { ThemeLayer } from "@radroots/theme";
    import { fmt_cl, type ITrellisDefaultLabel } from "@radroots/util";

    let {
        layer,
        labels,
        classes = ``,
    }: {
        layer: ThemeLayer;
        labels: ITrellisDefaultLabel[];
        classes?: string;
    } = $props();
</script>

<div class={`${fmt_cl(classes)} flex flex-row`}>
    <p class={`font-sans text-trellis_ti text-layer-${layer}-glyph-shade`}>
        {#each labels as label}
            <span class={`${fmt_cl(label.classes)} font-sans text-trellis_ti`}>
                {#if `callback` in label}
                    <button
                        class={``}
                        onclick={async () => {
                            if (`callback` in label && label.callback)
                                await label.callback();
                        }}
                    >
                        {label.label}
                    </button>
                {:else}
                    {label.label}
                {/if}
            </span>
        {/each}
    </p>
</div>

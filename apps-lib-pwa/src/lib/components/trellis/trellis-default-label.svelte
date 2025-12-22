<script lang="ts">
    import type { ITrellisDefaultLabel } from "$lib/types/components/trellis";
    import { fmt_cl } from "@radroots/apps-lib";
    import type { ThemeLayer } from "@radroots/themes";

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
    <p class={`font-sans text-trellis_ti text-ly${layer}-gl-shade`}>
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

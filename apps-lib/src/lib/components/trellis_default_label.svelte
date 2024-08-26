<script lang="ts">
    import type { ThemeLayer } from "@radroots/theme";
    import { fmt_cl, type ITrellisDefaultLabel } from "..";

    export let classes = ``;
    export let layer: ThemeLayer;
    export let labels: ITrellisDefaultLabel[];
</script>

<div class={`${fmt_cl(classes)} flex flex-row`}>
    <p class={`font-sans text-labelTrellis text-layer-${layer}-glyph-shade`}>
        {#each labels as label}
            <span
                class={`${fmt_cl(label.classes)} font-sans text-labelTrellis`}
            >
                {#if `route` in label}
                    <a href={label.route}>
                        {label.label}
                    </a>
                {:else if `callback` in label}
                    <button
                        class={``}
                        on:click|preventDefault={async () => {
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
